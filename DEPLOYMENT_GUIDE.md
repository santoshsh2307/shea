# Enterprise Application - Docker Blue-Green Deployment Guide

## Overview

This deployment setup provides **zero-downtime deployments** for both the enterprise-backend (Spring Boot) and enterprise-ui (React) applications using **Blue-Green deployment strategy** with Docker Compose and Nginx reverse proxy.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      External Users                          │
│                    (Internet Access)                          │
└───────────────────────┬─────────────────────────────────────┘
                        │ :80
                        ▼
        ┌───────────────────────────────────┐
        │   Nginx Reverse Proxy/LB           │
        │   (Blue-Green Traffic Router)      │
        └──┬───────────────────────────────┬─┘
           │                               │
      Blue │                          Green│
           │                               │
    ┌──────▼────────┐          ┌──────────▼─────┐
    │ Backend Blue  │          │ Backend Green   │
    │ (Port 8081)   │          │ (Port 8082)     │
    └─────┬────────┘          └────────┬────────┘
          │                            │
    ┌─────▼────────────────────────────▼─────┐
    │        Shared MySQL Database           │
    │    (Single persistent instance)        │
    └────────────────────────────────────────┘
    
    ┌──────────────┐          ┌──────────────┐
    │Frontend Blue │          │Frontend Green│
    │ (Port 3001)  │          │ (Port 3002)  │
    └──────────────┘          └──────────────┘
```

---

## Key Features

✅ **Zero Downtime Deployments** - Switch traffic without service interruption  
✅ **Automatic Health Checks** - Verify services are ready before switching  
✅ **One-Command Deployments** - Simple CLI for managing deployments  
✅ **Instant Rollback** - Revert to previous version immediately  
✅ **Load Balancing** - Nginx acts as reverse proxy  
✅ **Persistent Database** - Single shared MySQL database  
✅ **Containerized** - Consistent environment across stages  

---

## Prerequisites

- Docker and Docker Compose installed on your machine
- Both applications must be built (Java JAR and React build folder)
- Minimum 4GB RAM available
- Ports 80, 8000, 3306 available on your machine

### Verify Prerequisites

```bash
docker --version
docker-compose --version
```

---

## Setup Instructions

### Step 1: Rebuild the applications

```bash
# Build backend
cd enterprise-backend
mvn clean package -DskipTests
cd ..

# Build frontend
cd enterprise-ui
npm install
npm run build
cd ..
```

### Step 2: Make the deployment script executable

```bash
chmod +x deploy.sh
```

### Step 3: Initialize and start services

```bash
# Start all services in blue environment
./deploy.sh start
```

This will:
- Pull/build Docker images
- Start backend-blue and frontend-blue
- Initialize MySQL database
- Start Nginx reverse proxy
- All services running on blue environment

### Step 4: Access the application

```
Frontend: http://localhost:80
Backend API: http://localhost:80/api/
Admin Panel: http://localhost:8000
Direct Backend: http://localhost:8081
Direct Frontend: http://localhost:3001
```

---

## Deployment Workflow

### Initial State
```
┌────────────────────────────────────┐
│  Active: BLUE                       │
│  - Backend Blue  ✓ Running          │
│  - Frontend Blue ✓ Running          │
│  - MySQL Database ✓ Running         │
│                                      │
│  Standby: GREEN                      │
│  - Backend Green  ✗ Stopped         │
│  - Frontend Green ✗ Stopped         │
└────────────────────────────────────┘
```

### To Deploy New Version

```bash
# 1. Deploy backend only
./deploy.sh deploy backend

# 2. Deploy frontend only
./deploy.sh deploy frontend

# 3. Deploy both together
./deploy.sh deploy all
```

### What Happens During Deployment

1. **Trigger**: Run `./deploy.sh deploy backend`
2. **Build**: Uses latest Dockerfile to build new images
3. **Start Green**: Spins up backend-green container
4. **Wait**: Nginx waits for health checks to pass (30 attempts × 5 seconds = 150 seconds max)
5. **Verify**: Confirms backend-green is healthy
6. **Switch**: Nginx routes traffic from blue → green
7. **Cleanup**: Stops old backend-blue container
8. **Result**: Zero downtime! Users never notice.

### After Deployment
```
┌────────────────────────────────────┐
│  Active: GREEN  (new version)       │
│  - Backend Green  ✓ Running         │
│  - Frontend Green ✓ Running         │
│  - MySQL Database ✓ Running         │
│                                      │
│  Standby: BLUE  (previous version)   │
│  - Backend Blue   ✗ Stopped         │
│  - Frontend Blue  ✗ Stopped         │
└────────────────────────────────────┘
```

---

## Common Commands

### View Status
```bash
./deploy.sh status

# Output:
# Active environment: blue
# Standby environment: green
# [Lists all running containers]
```

### View Logs
```bash
# All logs
./deploy.sh logs

# Specific service logs
./deploy.sh logs nginx
./deploy.sh logs backend-blue
./deploy.sh logs mysql
```

### Instant Rollback (if something goes wrong)
```bash
./deploy.sh rollback

# Switches traffic back to previous version instantly
# No downtime!
```

### Restart Services
```bash
./deploy.sh restart
```

### Stop All Services
```bash
./deploy.sh stop
```

### Full Cleanup
```bash
./deploy.sh clean

# ⚠️ WARNING: Removes all containers and volumes
# Use only if you want to start fresh
```

---

## Accessing from Outside

### Direct Access

The application is accessible at:
- **Frontend**: `http://<your-machine-ip>:80`
- **Backend**: `http://<your-machine-ip>:80/api/`
- **Admin Panel**: `http://<your-machine-ip>:8000`

### Find Your Machine IP

```bash
# On macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig
```

### Example
If your machine IP is `192.168.1.100`:
- Access from other machines: `http://192.168.1.100`
- Access from same machine: `http://localhost`

### Remote Server Deployment

For deploying on a remote server:

1. **SSH into the server**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Docker & Docker Compose**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

3. **Clone your project**
   ```bash
   git clone <your-repo> enterprise-app
   cd enterprise-app
   ```

4. **Deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh deploy all
   ```

5. **Access from anywhere**
   ```
   http://your-server.com
   ```

---

## Health Checks & Monitoring

### Automated Health Checks

The deployment script performs health checks:

**Backend Health Check**:
```
GET http://backend-blue:8080/actuator/health
Expected: 200 OK with "status": "UP"
```

**Frontend Health Check**:
```
GET http://frontend-blue:80/
Expected: 200 OK (HTML page)
```

### Manual Health Checks

```bash
# Check backend health
curl http://localhost:8081/actuator/health

# Check frontend
curl http://localhost:3001

# Check API
curl http://localhost:8081/api/users
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
./deploy.sh logs

# Check if ports are in use
lsof -i :80
lsof -i :3306
lsof -i :8080

# If ports are in use, stop conflicting services
# Then try again
./deploy.sh start
```

### Health checks failing

```bash
# Increase health check timeout
# Edit docker-compose.yml and increase start_period value

# Manually check if service is responding
curl -v http://localhost:8081/actuator/health
curl -v http://localhost:3001
```

### Database connection issues

```bash
# Check MySQL container
docker logs enterprise-mysql

# Verify database is initialized
docker exec enterprise-mysql mysql -u enterprise_user -p enterprise_password -e "SELECT * FROM users;"
```

### Traffic not switching

```bash
# Check active environment
cat active_env.txt

# Check nginx configuration
docker exec enterprise-nginx nginx -t

# View nginx logs
./deploy.sh logs nginx
```

### Persistent issues? Reset everything

```bash
# Stop and remove everything
./deploy.sh clean

# Rebuild images
./deploy.sh build

# Start fresh
./deploy.sh start
```

---

## Performance Tuning

### Database Connection Pool
Edit `docker-compose.yml` to adjust:
```yaml
environment:
  - SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE=20
```

### Java Memory
Edit `docker-compose.yml`:
```yaml
environment:
  - JAVA_OPTS=-Xmx1024m -Xms512m  # Increase for large applications
```

### Nginx Buffer Size
Edit `nginx.conf`:
```nginx
proxy_buffer_size 128k;
proxy_buffers 4 256k;
```

---

## Monitoring & Logs

### View Real-time Logs

```bash
# Follow all logs
./deploy.sh logs -f

# Follow specific service
./deploy.sh logs -f backend-blue
./deploy.sh logs -f frontend-blue
./deploy.sh logs -f nginx
```

### Metrics Endpoint

Available metrics:
```
http://localhost:8081/actuator/metrics
http://localhost:8081/actuator/prometheus
```

---

## Backup & Recovery

### Backup Database

```bash
docker exec enterprise-mysql mysqldump \
  -u enterprise_user -p enterprise_password \
  enterprise_db > backup.sql
```

### Restore Database

```bash
docker exec -i enterprise-mysql mysql \
  -u enterprise_user -p enterprise_password \
  enterprise_db < backup.sql
```

---

## Production Checklist

- [ ] Build both applications
- [ ] Test deployment in staging
- [ ] Verify health checks pass
- [ ] Test rollback procedure
- [ ] Configure DNS/domain name
- [ ] Setup SSL/TLS certificate (with Nginx)
- [ ] Configure backups
- [ ] Setup monitoring/alerting
- [ ] Document runbooks
- [ ] Train team on deployment process

---

## Next Steps

1. ✅ Run initial deployment:
   ```bash
   ./deploy.sh deploy all
   ```

2. ✅ Test the application at:
   ```
   http://localhost
   ```

3. ✅ Try rolling back:
   ```bash
   ./deploy.sh rollback
   ```

4. ✅ Deploy updated code:
   ```bash
   ./deploy.sh deploy backend  # or frontend or all
   ```

5. ✅ Monitor logs:
   ```bash
   ./deploy.sh logs -f
   ```

---

## Support

For issues or questions:
1. Check logs: `./deploy.sh logs`
2. Check status: `./deploy.sh status`
3. Review troubleshooting section above
4. Use `./deploy.sh help` for all available commands

---

**Congratulations! Your enterprise application is now deployed with zero-downtime capability! 🎉**
