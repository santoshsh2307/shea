#!/bin/bash

###############################################################################
# Enterprise Application - Quick Setup Script
# Sets up Docker deployment in 5 minutes
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker not installed. Please install Docker first."
    fi
    print_success "Docker is installed"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose not installed. Please install Docker Compose first."
    fi
    print_success "Docker Compose is installed"
    
    # Check if applications are built
    if [ ! -f "enterprise-backend/target/enterprise-backend-1.0.0.jar" ]; then
        print_warning "Backend JAR not found. Building now..."
        build_backend
    fi
    print_success "Backend JAR exists"
    
    if [ ! -d "enterprise-ui/build" ]; then
        print_warning "Frontend build not found. Building now..."
        build_frontend
    fi
    print_success "Frontend build exists"
    
    # Check required files
    for file in docker-compose.yml nginx.conf Dockerfile.backend Dockerfile.frontend init-db.sql deploy.sh; do
        if [ ! -f "$file" ]; then
            print_error "Missing required file: $file"
        fi
    done
    print_success "All required files present"
}

# Build backend
build_backend() {
    print_header "Building Backend"
    cd enterprise-backend
    mvn clean package -DskipTests
    cd ..
    print_success "Backend built successfully"
}

# Build frontend
build_frontend() {
    print_header "Building Frontend"
    cd enterprise-ui
    npm install
    npm run build
    cd ..
    print_success "Frontend built successfully"
}

# Setup deployment files
setup_deployment() {
    print_header "Setting up Deployment Files"
    
    # Make deploy script executable
    chmod +x deploy.sh
    print_success "Deployment script is executable"
    
    # Initialize active_env.txt
    echo "blue" > active_env.txt
    print_success "Environment configuration initialized"
}

# Start services
start_services() {
    print_header "Starting Services"
    
    print_info "This will start Docker containers..."
    print_info "Pulling/building images (may take a few minutes on first run)..."
    
    docker-compose up -d
    
    print_success "Services started"
    
    # Wait for services to be ready
    print_info "Waiting for services to become healthy..."
    sleep 10
}

# Display access information
show_access_info() {
    print_header "✅ Setup Complete!"
    
    echo ""
    echo -e "${GREEN}Your application is now running!${NC}"
    echo ""
    echo "Access URLs:"
    echo -e "${YELLOW}  Frontend:${NC}      http://localhost"
    echo -e "${YELLOW}  Backend API:${NC}   http://localhost/api/"
    echo -e "${YELLOW}  Admin Panel:${NC}   http://localhost:8000"
    echo ""
    echo "Useful Commands:"
    echo -e "${YELLOW}  Status:${NC}        ./deploy.sh status"
    echo -e "${YELLOW}  Logs:${NC}          ./deploy.sh logs"
    echo -e "${YELLOW}  Deploy:${NC}        ./deploy.sh deploy <backend|frontend|all>"
    echo -e "${YELLOW}  Rollback:${NC}      ./deploy.sh rollback"
    echo -e "${YELLOW}  Help:${NC}          ./deploy.sh help"
    echo ""
    echo "Full documentation: See DEPLOYMENT_GUIDE.md"
    echo ""
    
    # Get local IP
    if [[ "$OSTYPE" == "darwin"* ]]; then
        local_ip=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
    else
        local_ip=$(hostname -I | awk '{print $1}')
    fi
    
    if [ ! -z "$local_ip" ]; then
        echo -e "${GREEN}Access from other machines:${NC}"
        echo -e "${YELLOW}  http://$local_ip${NC}"
    fi
}

# Main execution
main() {
    print_header "Enterprise Application Setup"
    
    echo ""
    print_info "This script will:"
    echo "  1. Verify Docker and prerequisites"
    echo "  2. Build applications if needed"
    echo "  3. Configure deployment files"
    echo "  4. Start all Docker services"
    echo ""
    
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled"
        exit 0
    fi
    
    echo ""
    check_prerequisites
    echo ""
    setup_deployment
    echo ""
    start_services
    echo ""
    show_access_info
}

# Run main
main
