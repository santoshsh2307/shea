# Enterprise Backend - Spring Boot

This is a Spring Boot backend application for the Enterprise UI project. It provides REST APIs for user authentication and management.

## Prerequisites

- Java 17+
- Maven 3.6+

## Project Structure

```
src/main/java/com/enterprise/app/
├── config/              # Configuration classes (CORS, Data Initialization)
├── controller/          # REST Controllers (AuthController, UserController)
├── dto/                 # Data Transfer Objects (LoginRequest, UserDTO, etc.)
├── entity/              # JPA Entities (User)
├── repository/          # Spring Data Repositories (UserRepository)
├── service/             # Business Logic Services (UserService)
└── EnterpriseBackendApplication.java  # Main Application Class

src/main/resources/
└── application.yml      # Application Configuration
```

## Database Schema (H2)

The application uses H2 in-memory database. The DDL is automatically updated via Hibernate.

### User Table

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    contact_number VARCHAR(20),
    occupation VARCHAR(255),
    education VARCHAR(255),
    blood_group VARCHAR(10),
    membership_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/login` - User Login

### User Management
- **GET** `/api/v1/users` - Get all users
- **GET** `/api/v1/users/{id}` - Get user by ID
- **GET** `/api/v1/users/username/{username}` - Get user by username
- **POST** `/api/v1/users` - Create new user
- **PUT** `/api/v1/users/{id}` - Update user
- **DELETE** `/api/v1/users/{id}` - Delete user

## Running the Application

### Option 1: Using Maven
```bash
mvn spring-boot:run
```

### Option 2: Building and Running JAR
```bash
mvn clean package
java -jar target/enterprise-backend-1.0.0.jar
```

## Default Credentials

The application initializes with a default admin user:
- Username: `admin`
- Password: `admin123`

## H2 Database Console

Access the H2 Console at: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:enterprisedb`
- User: `sa`
- Password: (leave empty)

## Configuration

Edit `src/main/resources/application.yml` to configure:
- Server port
- Database settings
- CORS allowed origins
- Logging levels

## Sample API Requests

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Users
```bash
curl http://localhost:8080/api/v1/users
```

### Create User
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "password":"pass123",
    "email":"user@example.com",
    "firstName":"New",
    "lastName":"User",
    "contactNumber":"9876543210",
    "occupation":"Engineer",
    "education":"Bachelor",
    "bloodGroup":"O+",
    "membershipType":"Standard"
  }'
```

### Update User
```bash
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@example.com"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:8080/api/v1/users/1
```

## Integration with React Frontend

The React frontend can communicate with this backend using:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';

// Login
fetch(`${API_BASE_URL}/v1/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})

// Get Users
fetch(`${API_BASE_URL}/v1/users`)

// Create User
fetch(`${API_BASE_URL}/v1/users`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})
```

## Logging

Logs are printed to console. Configure log levels in `application.yml`:
```yaml
logging:
  level:
    root: INFO
    com.enterprise.app: DEBUG
```

## Support

For issues or questions, please create an issue in the project repository.
