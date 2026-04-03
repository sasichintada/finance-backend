# Finance Backend API – Data Processing & Access Control System

---

## 📌 Project Description

**Finance Backend API** is a comprehensive backend system for managing financial transactions with role-based access control. Built for the Zorvyn FinTech backend developer intern assignment, this system provides complete user management, financial record keeping, dashboard analytics, and granular permission controls.

The system supports three user roles (Viewer, Analyst, Admin) with distinct permissions, JWT-based authentication, full CRUD operations on financial transactions, and powerful dashboard analytics including income/expense tracking, category-wise breakdowns, and monthly trends.

---

## 🚀 Features

### ✅ Implemented Features

- **User Authentication** – JWT-based login with bcrypt password hashing (24hr token expiry)
- **Role-Based Access Control** – Three roles (Viewer, Analyst, Admin) with granular permissions
- **User Management** – Create, read, update, delete users with soft delete functionality
- **Financial Records CRUD** – Full create, read, update, delete operations for transactions
- **Transaction Filtering** – Filter by date range, transaction type (income/expense), and category
- **Dashboard Analytics** – Total income, total expenses, net balance, transaction count
- **Category-wise Totals** – Breakdown of income and expenses by category
- **Monthly Trends** – Track income/expense patterns over time
- **Recent Activity** – Latest transactions with user details
- **Pagination Support** – Page-based pagination for transaction listings (configurable limits)
- **Input Validation** – Comprehensive request validation with express-validator
- **Error Handling** – Proper HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500)
- **Data Persistence** – SQLite database with full schema (PostgreSQL ready)
- **API Documentation** – Interactive Swagger/OpenAPI documentation
- **Soft Delete** – User accounts can be deactivated (status='inactive') instead of hard delete
- **Secure Password Storage** – bcrypt hashing with 10 salt rounds

---

## 🛠 Tech Stack

### 🖥 Backend

| Technology | Purpose |
|------------|---------|
| Node.js 18+ | JavaScript Runtime |
| Express.js 4.18 | Web Framework |
| SQLite3 | Database (default) |
| PostgreSQL | Optional production database |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password Hashing |
| express-validator | Input Validation |
| dotenv | Environment Configuration |
| cors | Cross-origin Resource Sharing |

### 📚 Documentation

| Technology | Purpose |
|------------|---------|
| Swagger UI | Interactive API Documentation |
| OpenAPI 3.0 | API Specification |
| swagger-jsdoc | Generate docs from JSDoc comments |

### 🗄 Database Schema

| Table | Purpose |
|-------|---------|
| users | Store user accounts (id, email, password_hash, name, role, status, timestamps) |
| transactions | Store financial records (id, user_id, amount, type, category, date, description, timestamps) |

---

## 📂 Project Structure

```bash
finance-backend/
├── src/
│   ├── config/
│   │   ├── database.js              # Database connection (SQLite/PostgreSQL)
│   │   └── swagger.js               # Swagger/OpenAPI configuration
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication & role authorization
│   │   ├── validation.js            # Request validation middleware
│   │   └── errorHandler.js          # Centralized error handling
│   ├── services/
│   │   ├── authService.js           # Login logic, JWT generation
│   │   ├── userService.js           # User CRUD operations
│   │   ├── transactionService.js    # Transaction CRUD & filtering
│   │   └── dashboardService.js      # Analytics & summary logic
│   ├── controllers/
│   │   ├── authController.js        # Login endpoint handler
│   │   ├── userController.js        # User endpoint handlers
│   │   ├── transactionController.js # Transaction endpoint handlers
│   │   └── dashboardController.js   # Dashboard endpoint handlers
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── users.js                 # User management routes (Admin only)
│   │   ├── transactions.js          # Transaction CRUD routes
│   │   └── dashboard.js             # Analytics routes
│   ├── utils/
│   │   └── constants.js             # Role definitions & permissions matrix
│   └── app.js                       # Main application entry point
├── .env                             # Environment variables
├── .gitignore                       # Git ignore file
├── package.json                     # Dependencies & scripts
├── finance.db                       # SQLite database (auto-created)
└── README.md                        # Project documentation
```

---

## 🔐 Role-Based Access Control Matrix

| Role | View Transactions | Create Transaction | Update Transaction | Delete Transaction | View Dashboard | Manage Users |
|------|------------------|-------------------|-------------------|-------------------|----------------|--------------|
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Analyst** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Permission Implementation

```javascript
// constants.js
const ROLE_PERMISSIONS = {
  viewer: {
    canViewTransactions: true,
    canCreateTransaction: false,
    canUpdateTransaction: false,
    canDeleteTransaction: false,
    canViewDashboard: true,
    canManageUsers: false
  },
  analyst: {
    canViewTransactions: true,
    canCreateTransaction: true,
    canUpdateTransaction: true,
    canDeleteTransaction: true,
    canViewDashboard: true,
    canManageUsers: false
  },
  admin: {
    canViewTransactions: true,
    canCreateTransaction: true,
    canUpdateTransaction: true,
    canDeleteTransaction: true,
    canViewDashboard: true,
    canManageUsers: true
  }
};
```

---

### Sample API Responses

**Dashboard Summary:**
```json
{
  "total_income": 7500,
  "total_expenses": 350,
  "net_balance": 7150,
  "transaction_count": 4
}
```

**Category Totals:**
```json
{
  "income": {
    "Salary": 5000,
    "Freelance": 2500
  },
  "expense": {
    "Food": 200,
    "Transport": 150
  }
}
```

**Transaction Object:**
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 1500.00,
  "type": "income",
  "category": "Salary",
  "date": "2024-04-02",
  "description": "Monthly salary",
  "created_at": "2026-04-02T13:07:25.000Z",
  "updated_at": "2026-04-02T13:07:25.000Z",
  "user_name": "Admin User"
}
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/finance-backend.git
cd finance-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here_change_this
DB_TYPE=sqlite

# For PostgreSQL (optional - change DB_TYPE to 'postgres')
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=finance_db
# DB_USER=postgres
# DB_PASSWORD=password
```

### 4️⃣ Start the Server

```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

### 5️⃣ Verify Installation

Open browser and navigate to:
- API Root: `http://localhost:3000/`
- Health Check: `http://localhost:3000/health`
- Swagger Docs: `http://localhost:3000/api-docs`

---

## 🔑 Default Admin Account

After first run, the database auto-creates with:

| Field | Value |
|-------|-------|
| Email | admin@finance.com |
| Password | admin123 |
| Role | admin |

**⚠️ Important:** Change password in production!

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Login user | Public |

### 📊 Dashboard Analytics

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/summary` | Financial summary (income, expenses, net) | All roles |
| GET | `/api/dashboard/categories` | Category-wise income/expense totals | All roles |
| GET | `/api/dashboard/trends` | Monthly income/expense trends | All roles |
| GET | `/api/dashboard/recent` | Recent transaction activity | All roles |
| GET | `/api/dashboard/full` | Complete dashboard (all metrics) | All roles |

### 💰 Transactions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/transactions` | Create new transaction | Analyst, Admin |
| GET | `/api/transactions` | List transactions (with filters) | All roles |
| GET | `/api/transactions/:id` | Get transaction by ID | All roles |
| PUT | `/api/transactions/:id` | Update transaction | Analyst, Admin |
| DELETE | `/api/transactions/:id` | Delete transaction | Analyst, Admin |

### 👥 Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create new user |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user (name, role, status) |
| DELETE | `/api/users/:id` | Soft delete user (status='inactive') |

---

## 🔍 Filtering & Pagination

### Transaction Filters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| type | string | `income` or `expense` | Filter by transaction type |
| category | string | `Salary` | Filter by category |
| startDate | date | `2024-01-01` | Start date for date range |
| endDate | date | `2024-12-31` | End date for date range |
| page | integer | `1` | Page number (default: 1) |
| limit | integer | `20` | Items per page (default: 50, max: 100) |
| viewAll | boolean | `true` | Admin only - view all users' transactions |

### Example Filter Requests

```bash
# Filter by expense type
GET /api/transactions?type=expense

# Filter by date range
GET /api/transactions?startDate=2024-01-01&endDate=2024-12-31

# Filter by category
GET /api/transactions?category=Food

# Combined filters with pagination
GET /api/transactions?type=expense&category=Food&startDate=2024-04-01&page=1&limit=10

# Admin view all users' transactions
GET /api/transactions?viewAll=true
```

---

## 🧪 Testing with cURL

### 1. Login (Get JWT Token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"admin123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@finance.com",
    "name": "Admin User",
    "role": "admin",
    "status": "active"
  }
}
```

### 2. Create Transaction (Income)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500.00,
    "type": "income",
    "category": "Salary",
    "date": "2024-04-02",
    "description": "Monthly salary"
  }'
```

### 3. Create Transaction (Expense)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200.00,
    "type": "expense",
    "category": "Food",
    "date": "2024-04-02",
    "description": "Lunch"
  }'
```

### 4. Get Dashboard Summary

```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get All Transactions

```bash
curl -X GET "http://localhost:3000/api/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Filter Expense Transactions

```bash
curl -X GET "http://localhost:3000/api/transactions?type=expense&startDate=2024-04-01&endDate=2024-04-30" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Create New User (Admin only)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "viewer@example.com",
    "password": "password123",
    "name": "Test Viewer",
    "role": "viewer"
  }'
```

### 8. Get All Users (Admin only)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Update Transaction

```bash
curl -X PUT http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1600.00, "description": "Updated salary"}'
```

### 10. Delete Transaction

```bash
curl -X DELETE http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Error Handling Examples

| Scenario | Status Code | Response |
|----------|-------------|----------|
| Invalid credentials | 401 | `{"error": "Invalid credentials"}` |
| Insufficient permissions | 403 | `{"error": "Access denied. Insufficient permissions."}` |
| Missing required fields | 400 | `{"error": "Validation failed", "details": [...]}` |
| Duplicate email | 409 | `{"error": "Email already exists"}` |
| Transaction not found | 404 | `{"error": "Transaction not found"}` |
| Invalid token | 401 | `{"error": "Invalid or expired token"}` |
| Account inactive | 403 | `{"error": "Account is inactive"}` |

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
```

---


---

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment (development/production) |
| JWT_SECRET | Yes | - | Secret key for JWT signing |
| DB_TYPE | No | sqlite | Database type (sqlite/postgres) |
| DB_HOST | For PostgreSQL | - | PostgreSQL host |
| DB_PORT | For PostgreSQL | 5432 | PostgreSQL port |
| DB_NAME | For PostgreSQL | - | Database name |
| DB_USER | For PostgreSQL | - | Database user |
| DB_PASSWORD | For PostgreSQL | - | Database password |

---

## 🤔 Assumptions & Trade-offs

| Area | Decision | Rationale |
|------|----------|-----------|
| Database | SQLite (default) | Zero configuration, file-based, perfect for assessment. PostgreSQL supported via env var. |
| Authentication | JWT with 24hr expiry | Stateless, no session storage, sufficient for assignment scope |
| Soft Delete | Users only (status='inactive') | Preserve transaction history, prevent orphaned records |
| Transaction Ownership | Users see only their own | Privacy by default, admins can view all with `viewAll=true` |
| Analyst Permissions | Full transaction CRUD | Can manage financial data but not user accounts |
| Password Security | bcrypt (10 rounds) | Industry standard, sufficient for non-production use |
| Pagination | Default 50, max 100 | Prevents large payloads, configurable by client |
| No Refresh Tokens | Simplified implementation | Assignment scope, would add in production |
| No Rate Limiting | Omitted for simplicity | Can add `express-rate-limit` for production |

---

## 🚧 Future Improvements

- [ ] Refresh token mechanism for better security
- [ ] Rate limiting to prevent API abuse
- [ ] Unit tests with Jest and Supertest
- [ ] Integration tests for all endpoints
- [ ] Email notifications for account events
- [ ] Transaction export (CSV, PDF, Excel)
- [ ] Recurring/scheduled transactions
- [ ] Budget categories with spending limits
- [ ] WebSocket for real-time dashboard updates
- [ ] Multi-factor authentication (MFA)
- [ ] Audit logging for sensitive operations
- [ ] API versioning (v1, v2)
- [ ] Redis caching for dashboard data
- [ ] Docker containerization
- [ ] CI/CD pipeline with GitHub Actions

---

## 👩‍💻 Author

**Sasank Kumari Chintada**  
- Email: sasichinthada248@gmail.com  
- GitHub: [@sasichintada](https://github.com/sasichintada)  

---
---

**🎉 Ready to use! Access API at http://localhost:3000**  
**📚 Interactive Documentation: http://localhost:3000/api-docs**  
**🔑 Default Admin: admin@finance.com / admin123**

---
