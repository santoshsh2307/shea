# Quick Start Guide - Enterprise Application

## TLDR - Start Both Applications

### Terminal 1: Start Backend
```bash
cd /Users/admin/Desktop/project/enterprise-backend
mvn spring-boot:run
```
✅ Backend runs on: `http://localhost:8080`

### Terminal 2: Start Frontend
```bash
cd /Users/admin/Desktop/project/enterprise-ui
npm install  # First time only
npm start
```
✅ Frontend runs on: `http://localhost:3000`

---

## Browser Access

1. Open `http://localhost:3000` in your browser
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Dashboard opens with user management features

---

## Testing the Backend API

### With cURL:

#### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Get All Users
```bash
curl http://localhost:8080/api/v1/users
```

#### Create New User
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"test123",
    "email":"test@example.com",
    "firstName":"Test",
    "lastName":"User",
    "contactNumber":"9876543210",
    "occupation":"Developer",
    "education":"Bachelor'\''s",
    "bloodGroup":"O+",
    "membershipType":"Standard"
  }'
```

---

## Database Console

Access H2 Database Console:
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:enterprisedb`
- User: `sa`
- Password: (leave blank)

---

## File Locations

### Backend Files
- **Source:** `/Users/admin/Desktop/project/enterprise-backend/src/main/java/com/enterprise/app/`
- **Config:** `/Users/admin/Desktop/project/enterprise-backend/src/main/resources/application.yml`
- **Documentation:** `/Users/admin/Desktop/project/enterprise-backend/README.md`

### Frontend API Service
- **Location:** `/Users/admin/Desktop/project/enterprise-ui/src/api/userService.js`

### New Backend-Integrated Components
- **Users:** `/Users/admin/Desktop/project/enterprise-ui/src/pages/Users_new.js`
- **CreateUser:** `/Users/admin/Desktop/project/enterprise-ui/src/pages/CreateUser_new.js`

---

## Available Users (Pre-populated)

| Username   | Password    | Role  |
|-----------|-----------|-------|
| admin     | admin123   | Admin |
| john_doe  | password123| User  |
| jane_smith| password456| User  |

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Address already in use" on port 8080 | Kill process: `lsof -i :8080` then `kill -9 <PID>` |
| Axios not found | Run: `npm install axios` |
| Backend API not responding | Check if backend is running: `http://localhost:8080/api/v1/users` |
| CORS error | Ensure backend runs on port 8080 |

---

## Database Schema

```sql
users (
  id BIGINT PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  contact_number VARCHAR,
  occupation VARCHAR,
  education VARCHAR,
  blood_group VARCHAR,
  membership_type VARCHAR,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## API Base URL

```
http://localhost:8080/api
```

All endpoints use this base URL:
- `POST /v1/auth/login` - Login
- `GET /v1/users` - List all users
- `POST /v1/users` - Create user
- `PUT /v1/users/{id}` - Update user
- `DELETE /v1/users/{id}` - Delete user

---

## Next Steps

1. ✅ Backend and Frontend are set up
2. 📝 Replace old components with new ones in your code
3. 🧪 Test all CRUD operations
4. 🔒 Add JWT authentication (optional)
5. 🗄️ Switch to MySQL/PostgreSQL for production
6. 🚀 Deploy to cloud

---

For detailed information, see: `/Users/admin/Desktop/project/INTEGRATION_GUIDE.md`
