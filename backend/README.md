# Employee Management System - ASP.NET Core 8 Backend

## Getting Started

### 1. Update Configuration
- Edit `appsettings.json` with your SQL Server connection string and a secure JWT secret key.

### 2. Apply Migrations & Create Database
```
dotnet tool install --global dotnet-ef # if not already installed
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 3. Run the API
```
dotnet run
```

### 4. API Usage
- Swagger UI: https://localhost:5001/swagger (with JWT support)
- Register: `POST /api/account/register`
- Login: `POST /api/account/login` (returns JWT)
- Profile: `GET /api/account/profile` (JWT required)
- Employees CRUD: `/api/employee` (JWT required)

### 5. CORS
- CORS is enabled for any origin (for Angular frontend integration).

### 6. Error Handling
- All errors return a JSON response with an `error` property.

---

**For frontend integration, use the JWT token in the `Authorization: Bearer {token}` header.**
