# Enterprise UI & Spring Boot Backend - Integration Guide

## Project Overview

This project consists of two parts:
1. **React Frontend** (`enterprise-ui`) - User interface built with React and Ant Design
2. **Spring Boot Backend** (`enterprise-backend`) - REST API server using Spring Boot with H2 database

Both projects are located in `/Users/admin/Desktop/project/`

### Project Structure
```
/Users/admin/Desktop/project/
├── enterprise-ui/          # React frontend application
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── pages/         # React page components
│   │   └── index.js
│   └── package.json
│
└── enterprise-backend/    # Spring Boot backend application
    ├── src/main/java/com/enterprise/app/
    │   ├── config/        # CORS and Data initialization
    │   ├── controller/    # REST controllers
    │   ├── entity/        # JPA entities
    │   ├── service/       # Business logic
    │   ├── repository/    # Data access layer
    │   └── dto/           # Data transfer objects
    ├── src/main/resources/
    │   └── application.yml
    └── pom.xml
```

## Prerequisites

### For Backend
- Java 17 or higher
- Maven 3.6 or higher
- Apache Maven installed and in PATH

### For Frontend
- Node.js 16+ and npm 8+
- Already installed as per package.json

## Setting Up and Running

### 1. Backend Setup (Spring Boot)

#### Step 1: Navigate to backend directory
```bash
cd /Users/admin/Desktop/project/enterprise-backend
```

#### Step 2: Build the project
```bash
mvn clean install
```

#### Step 3: Run the application
```bash
mvn spring-boot:run
```

Or build and run JAR:
```bash
mvn clean package
java -jar target/enterprise-backend-1.0.0.jar
```

**Backend will run on:** `http://localhost:8080`

#### Step 4: Access H2 Console (Optional)
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:enterprisedb`
- User: `sa`
- Password: (leave empty)

### 2. Frontend Setup (React)

#### Step 1: Navigate to frontend directory
```bash
cd /Users/admin/Desktop/project/enterprise-ui
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Start React development server
```bash
npm start
```

**Frontend will run on:** `http://localhost:3000`

## Database Schema

### User Table (Auto-created by Hibernate)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    contact_number VARCHAR(20),
    occupation VARCHAR(255),
    education VARCHAR(255),
    blood_group VARCHAR(10),
    membership_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

## REST API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Login
```
POST /v1/auth/login
Content-Type: application/json

Request Body:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login Successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@enterprise.com",
    "firstName": "Admin",
    "lastName": "User",
    "contactNumber": "9999999999",
    "occupation": "Administrator",
    "education": "Bachelor's",
    "bloodGroup": "O+",
    "membershipType": "Premium",
    "isActive": true
  }
}
```

### User Management Endpoints

#### Get All Users
```
GET /v1/users

Response:
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@enterprise.com",
    ...
  }
]
```

#### Get User by ID
```
GET /v1/users/{id}

Response:
{
  "id": 1,
  "username": "admin",
  ...
}
```

#### Get User by Username
```
GET /v1/users/username/{username}

Response:
{
  "id": 1,
  "username": "admin",
  ...
}
```

#### Create User
```
POST /v1/users
Content-Type: application/json

Request Body:
{
  "username": "newuser",
  "password": "pass123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "contactNumber": "9876543210",
  "occupation": "Engineer",
  "education": "Bachelor's",
  "bloodGroup": "A+",
  "membershipType": "Standard",
  "isActive": true
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "username": "newuser",
    ...
  }
}
```

#### Update User
```
PUT /v1/users/{id}
Content-Type: application/json

Request Body (only include fields to update):
{
  "email": "newemail@example.com",
  "membershipType": "Premium"
}

Response:
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "admin",
    ...
  }
}
```

#### Delete User
```
DELETE /v1/users/{id}

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Frontend Integration

### API Service
Location: `src/api/userService.js`

This file contains all API calls to the backend:
```javascript
import { loginUser, getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../api/userService";
```

### Components Updated for Backend Integration

#### 1. Login Component (`src/pages/Login.js`)
- Calls backend login API instead of hardcoded credentials
- Stores user info in localStorage
- Handles authentication errors

#### 2. Users Component (`src/pages/Users_new.js`)
- Fetches users from backend on component mount
- Integrates delete functionality with backend
- Supports pagination and filtering
- Has refresh button to reload data

#### 3. CreateUser Component (`src/pages/CreateUser_new.js`)
- Simplified form for creating or editing users
- Calls backend API for create/update operations
- Maps form fields to backend entity fields

### Using Backend-Integrated Components

To use the new backend-integrated components, replace the imports in your pages:

#### For Users Page:
```javascript
// Old
import Users from "./pages/Users";

// New (with backend)
import Users from "./pages/Users_new";
```

#### For CreateUser:
```javascript
// Old
import CreateUser from "./pages/CreateUser";

// New (with backend)
import CreateUser from "./pages/CreateUser_new";
```

## Default Test Credentials

The backend initializes with sample data:

| Username   | Password  | Type  |
|-----------|----------|-------|
| admin     | admin123  | Admin |
| john_doe  | password123 | User  |
| jane_smith| password456 | User  |

## Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Check port 8080 is available: `lsof -i :8080`
- Clear Maven cache: `mvn clean`

**Problem:** Database errors
- H2 is in-memory, data is lost on restart
- Data initializer recreates sample data automatically

### Frontend Issues

**Problem:** API calls fail with CORS error
- Ensure backend is running on port 8080
- Check CORS configuration in `application.yml`
- Browser console will show specific error

**Problem:** Axios not installed
```bash
npm install axios
```

**Problem:** Connection refused errors
- Verify backend URL is correct in `userService.js`
- Check firewall settings

## Configuration

### Backend Configuration
Edit `enterprise-backend/src/main/resources/application.yml`:
```yaml
spring:
  application:
    name: enterprise-backend
  datasource:
    url: jdbc:h2:mem:enterprisedb
  jpa:
    hibernate:
      ddl-auto: update
      
server:
  port: 8080
```

### Frontend Configuration
Backend URL in `enterprise-ui/src/api/userService.js`:
```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

To use a different backend URL:
```javascript
const API_BASE_URL = "http://your-backend-url.com/api";
```

## Next Steps

1. Replace old components with new backend-integrated ones
2. Test all CRUD operations in the UI
3. Add authentication token/JWT support for production
4. Add input validation on backend
5. Implement password encryption (BCrypt)
6. Add database migration strategy (Flyway/Liquibase)
7. Set up production database (MySQL/PostgreSQL instead of H2)

## Development Tips

- **Hot Reload Backend:** Use Spring Boot DevTools
- **Frontend Debugging:** Use React DevTools browser extension
- **API Testing:** Use Postman or cURL
- **Database Inspection:** Use H2 Console

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Ant Design Components](https://ant.design/components/overview/)
- [Axios Documentation](https://axios-http.com/)

## Support

For issues:
1. Check the logs in both frontend and backend
2. Verify both services are running
3. Test API endpoints using curl or Postman
4. Review error messages in browser console and backend logs
