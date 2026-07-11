# Quick Reference - Deployment Commands

## 🚀 First Time Setup

```bash
# Make scripts executable
chmod +x setup.sh deploy.sh

# Run automated setup (builds apps, starts services)
./setup.sh
```

**Result**: Application accessible at `http://localhost`

---

## 📊 Status & Monitoring

```bash
# Check deployment status
./deploy.sh status

# View all logs
./deploy.sh logs

# View specific service logs
./deploy.sh logs nginx
./deploy.sh logs backend-blue
./deploy.sh logs frontend-blue
./deploy.sh logs mysql

# Follow logs in real-time
./deploy.sh logs -f backend-blue
```

---

## 🚢 Deployments (Zero Downtime)

```bash
# Deploy backend only (current: blue → green, switch traffic)
./deploy.sh deploy backend

# Deploy frontend only
./deploy.sh deploy frontend

# Deploy both at once
./deploy.sh deploy all

# All deployments are zero-downtime!
```

---

## ⏮️ Rollback

```bash
# Instant rollback to previous version
./deploy.sh rollback

# No downtime - switches traffic instantly
```

---

## 🛑 Stop/Start Services

```bash
# Stop all services
./deploy.sh stop

# Start all services
./deploy.sh start

# Restart all services
./deploy.sh restart
```

---

## 🔧 Maintenance

```bash
# View active environment
cat active_env.txt

# Rebuild Docker images
./deploy.sh build

# Clean up (stops all, removes containers/volumes)
./deploy.sh clean
```

---

## 🌐 Access from Outside

### Same Machine
```
http://localhost
http://localhost/api/
http://localhost:8000  (admin panel)
```

### Other Machines on Network
```bash
# Find your machine IP
ifconfig | grep "inet "

# Then access from other machine:
# http://<your-ip>
# Example: http://192.168.1.100
```

### Remote Server
```bash
# After SSH into server
chmod +x deploy.sh setup.sh
./deploy.sh deploy all

# Access from anywhere:
# http://your-domain.com  (or IP address)
```

---

## 🔍 Troubleshooting

```bash
# Check if services are running
docker-compose ps

# See detailed error logs
./deploy.sh logs

# Check specific service
docker logs enterprise-backend-blue

# Verify ports are accessible
curl http://localhost/
curl http://localhost/api/health
curl http://localhost:8000

# Check port availability
lsof -i :80
lsof -i :3306
```

---

## 📈 Blue-Green Architecture

```
Current State (after first deployment):
┌─────────────────────────────────────┐
│ Active: BLUE                         │
│ ✓ Backend Blue running (8081)        │
│ ✓ Frontend Blue running (3001)       │
│ ✓ MySQL running (3306)               │
│                                      │
│ Standby: GREEN                       │
│ ✗ Not running (waiting for deploy)   │
└─────────────────────────────────────┘

After: ./deploy.sh deploy backend
┌─────────────────────────────────────┐
│ Active: GREEN (traffic switched)     │
│ ✓ Backend Green running (8082)       │
│ ✓ Frontend Blue still running        │
│ ✓ MySQL running (3306)               │
│                                      │
│ Standby: BLUE                        │
│ ✗ Stopped (previous version)         │
└─────────────────────────────────────┘
```

---

## 💾 Database Backup/Restore

```bash
# Backup database
docker exec enterprise-mysql mysqldump \
  -u enterprise_user -p enterprise_password \
  enterprise_db > backup.sql

# Restore database
docker exec -i enterprise-mysql mysql \
  -u enterprise_user -p enterprise_password \
  enterprise_db < backup.sql
```

---

## 🔑 Database Credentials

```
Host:     localhost (or mysql in docker network)
Port:     3306
Database: enterprise_db
Username: enterprise_user
Password: enterprise_password
Root:     root_password
```

---

## 📝 Application Configuration

### Backend Health Endpoints
```
/actuator/health        - Basic health
/actuator/metrics       - Metrics
/actuator/prometheus    - Prometheus metrics
```

### Database Connection
- **Inside containers**: `jdbc:mysql://mysql:3306/enterprise_db`
- **From host machine**: `jdbc:mysql://localhost:3306/enterprise_db`

---

## 🎯 Common Scenarios

### "I updated the backend code, how do I deploy?"
```bash
cd enterprise-backend
mvn clean package -DskipTests
cd ..
./deploy.sh deploy backend
```

### "I updated the frontend code, how do I deploy?"
```bash
cd enterprise-ui
npm run build
cd ..
./deploy.sh deploy frontend
```

### "Something went wrong, rollback!"
```bash
./deploy.sh rollback
# 5 seconds later - back to previous version, zero downtime!
```

### "I need to check the logs"
```bash
./deploy.sh logs -f
# Press Ctrl+C to exit
```

### "Where can I access the app?"
```
Local: http://localhost
Network: http://<your-local-ip>
Remote: http://<your-domain-or-server-ip>
```

---

## 📞 Need Help?

```bash
# See all available commands
./deploy.sh help

# See full deployment guide
cat DEPLOYMENT_GUIDE.md
```

---

**Remember**: All deployments are ZERO-DOWNTIME with instant rollback capability! 🎉
