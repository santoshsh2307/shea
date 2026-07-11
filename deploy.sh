#!/bin/bash

###############################################################################
# Blue-Green Deployment Script
# Manages zero-downtime deployments with automatic health checks
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ACTIVE_ENV_FILE="active_env.txt"
DOCKER_COMPOSE_FILE="docker-compose.yml"
NGINX_SHARED_VOLUME="nginx_shared"
MAX_HEALTH_CHECKS=30
HEALTH_CHECK_INTERVAL=5

###############################################################################
# Functions
###############################################################################

print_header() {
    echo -e "${BLUE}==================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}==================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

get_active_env() {
    if [ -f "$ACTIVE_ENV_FILE" ]; then
        cat "$ACTIVE_ENV_FILE"
    else
        echo "blue"
    fi
}

get_inactive_env() {
    local active=$(get_active_env)
    if [ "$active" = "blue" ]; then
        echo "green"
    else
        echo "blue"
    fi
}

# Health check for backend
health_check_backend() {
    local env=$1
    local port=$2
    local attempts=0
    
    print_info "Waiting for backend-$env to be healthy..."
    
    while [ $attempts -lt $MAX_HEALTH_CHECKS ]; do
        if curl -sf http://localhost:$port/actuator/health > /dev/null 2>&1; then
            print_success "Backend-$env is healthy"
            return 0
        fi
        
        attempts=$((attempts + 1))
        print_info "Health check attempt $attempts/$MAX_HEALTH_CHECKS..."
        sleep $HEALTH_CHECK_INTERVAL
    done
    
    print_error "Backend-$env failed health checks"
    return 1
}

# Health check for frontend
health_check_frontend() {
    local env=$1
    local port=$2
    local attempts=0
    
    print_info "Waiting for frontend-$env to be healthy..."
    
    while [ $attempts -lt $MAX_HEALTH_CHECKS ]; do
        if wget --quiet --tries=1 --spider http://localhost:$port/ 2>/dev/null; then
            print_success "Frontend-$env is healthy"
            return 0
        fi
        
        attempts=$((attempts + 1))
        print_info "Health check attempt $attempts/$MAX_HEALTH_CHECKS..."
        sleep $HEALTH_CHECK_INTERVAL
    done
    
    print_error "Frontend-$env failed health checks"
    return 1
}

# Switch traffic to new environment
switch_traffic() {
    local new_env=$1
    
    print_header "Switching traffic to $new_env"
    
    # Write to active_env.txt in the shared docker volume
    echo "$new_env" > "$ACTIVE_ENV_FILE"
    
    # Give nginx time to reload config
    sleep 2
    
    # Verify switch
    local current=$(get_active_env)
    if [ "$current" = "$new_env" ]; then
        print_success "Traffic switched to $new_env"
        return 0
    else
        print_error "Failed to switch traffic to $new_env"
        return 1
    fi
}

###############################################################################
# Main Commands
###############################################################################

case "${1:-help}" in
    deploy)
        if [ -z "$2" ]; then
            print_error "Usage: $0 deploy <backend|frontend|all>"
            exit 1
        fi
        
        print_header "Starting Blue-Green Deployment"
        
        local active_env=$(get_active_env)
        local inactive_env=$(get_inactive_env)
        
        print_info "Current active: $active_env"
        print_info "Target deployment: $inactive_env"
        
        case "$2" in
            backend)
                print_header "Deploying Backend to $inactive_env"
                
                docker-compose --profile $inactive_env up -d backend-$inactive_env
                health_check_backend $inactive_env $([ "$inactive_env" = "blue" ] && echo 8081 || echo 8082)
                
                if [ $? -eq 0 ]; then
                    switch_traffic $inactive_env
                    print_success "Backend deployment completed successfully"
                    
                    print_info "Stopping old instance backend-$active_env..."
                    docker-compose down backend-$active_env
                else
                    print_error "Backend health check failed. Rolling back..."
                    docker-compose down backend-$inactive_env
                    exit 1
                fi
                ;;
            
            frontend)
                print_header "Deploying Frontend to $inactive_env"
                
                docker-compose --profile $inactive_env up -d frontend-$inactive_env
                health_check_frontend $inactive_env $([ "$inactive_env" = "blue" ] && echo 3001 || echo 3002)
                
                if [ $? -eq 0 ]; then
                    switch_traffic $inactive_env
                    print_success "Frontend deployment completed successfully"
                    
                    print_info "Stopping old instance frontend-$active_env..."
                    docker-compose down frontend-$active_env
                else
                    print_error "Frontend health check failed. Rolling back..."
                    docker-compose down frontend-$inactive_env
                    exit 1
                fi
                ;;
            
            all)
                print_header "Deploying Both Applications"
                
                # Deploy backend
                docker-compose --profile $inactive_env up -d backend-$inactive_env
                health_check_backend $inactive_env $([ "$inactive_env" = "blue" ] && echo 8081 || echo 8082)
                
                if [ $? -ne 0 ]; then
                    print_error "Backend deployment failed"
                    exit 1
                fi
                
                # Deploy frontend
                docker-compose --profile $inactive_env up -d frontend-$inactive_env
                health_check_frontend $inactive_env $([ "$inactive_env" = "blue" ] && echo 3001 || echo 3002)
                
                if [ $? -ne 0 ]; then
                    print_error "Frontend deployment failed"
                    exit 1
                fi
                
                # Switch traffic
                switch_traffic $inactive_env
                
                # Stop old instances
                print_info "Stopping old instances..."
                docker-compose down backend-$active_env frontend-$active_env
                
                print_success "Full deployment completed successfully"
                ;;
            
            *)
                print_error "Unknown component: $2"
                print_info "Usage: $0 deploy <backend|frontend|all>"
                exit 1
                ;;
        esac
        ;;
    
    status)
        print_header "Deployment Status"
        
        local active=$(get_active_env)
        local inactive=$(get_inactive_env)
        
        print_info "Active environment: $active"
        print_info "Standby environment: $inactive"
        
        echo ""
        print_info "Active services:"
        docker-compose ps | grep "$active"
        
        echo ""
        print_info "All running containers:"
        docker ps --filter "label!=com.docker.compose.service" --format "table {{.Names}}\t{{.Status}}"
        ;;
    
    rollback)
        print_header "Rolling Back Deployment"
        
        local current=$(get_active_env)
        local previous=$(get_inactive_env)
        
        print_warning "Rolling back from $current to $previous"
        
        switch_traffic $previous
        
        print_success "Rollback completed. Now serving $previous"
        ;;
    
    logs)
        local service=$2
        if [ -z "$service" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$service"
        fi
        ;;
    
    start)
        print_header "Starting all services"
        docker-compose up -d
        print_success "All services started"
        ;;
    
    stop)
        print_header "Stopping all services"
        docker-compose down
        print_success "All services stopped"
        ;;
    
    restart)
        print_header "Restarting all services"
        docker-compose restart
        print_success "All services restarted"
        ;;
    
    build)
        print_header "Building Docker images"
        docker-compose build
        print_success "Images built successfully"
        ;;
    
    clean)
        print_header "Cleaning up Docker resources"
        read -p "Are you sure? This will remove all containers and volumes. (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            print_success "Cleanup completed"
        else
            print_info "Cleanup cancelled"
        fi
        ;;
    
    help|--help|-h)
        cat << EOF
${BLUE}Enterprise Application Blue-Green Deployment Script${NC}

${GREEN}Usage:${NC}
    $0 <command> [options]

${GREEN}Commands:${NC}
    ${YELLOW}deploy${NC} <backend|frontend|all>
        Deploy applications with zero downtime
        - backend: Deploy only backend service
        - frontend: Deploy only frontend service
        - all: Deploy both services

    ${YELLOW}status${NC}
        Show current deployment status and active environment

    ${YELLOW}rollback${NC}
        Instantly rollback to previous environment

    ${YELLOW}logs${NC} [service]
        View service logs (default: all services)

    ${YELLOW}start${NC}
        Start all services

    ${YELLOW}stop${NC}
        Stop all services

    ${YELLOW}restart${NC}
        Restart all services

    ${YELLOW}build${NC}
        Build Docker images

    ${YELLOW}clean${NC}
        Remove all containers and volumes (destructive)

    ${YELLOW}help${NC}
        Show this help message

${GREEN}Examples:${NC}
    # Deploy new backend version with zero downtime
    $0 deploy backend

    # Deploy both applications
    $0 deploy all

    # Check what's currently active
    $0 status

    # Instant rollback to previous version
    $0 rollback

    # View logs from nginx
    $0 logs nginx

EOF
        ;;
    
    *)
        print_error "Unknown command: $1"
        print_info "Run '$0 help' for usage information"
        exit 1
        ;;
esac
