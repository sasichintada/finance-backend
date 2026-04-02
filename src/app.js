const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Finance Backend API Documentation',
}));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Backend API is running',
    version: '1.0.0',
    documentation: 'http://localhost:3000/api-docs',
    endpoints: {
      authentication: {
        login: 'POST /api/auth/login'
      },
      users: {
        list: 'GET /api/users',
        create: 'POST /api/users',
        get: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      transactions: {
        list: 'GET /api/transactions',
        create: 'POST /api/transactions',
        get: 'GET /api/transactions/:id',
        update: 'PUT /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id'
      },
      dashboard: {
        summary: 'GET /api/dashboard/summary',
        categories: 'GET /api/dashboard/categories',
        trends: 'GET /api/dashboard/trends',
        recent: 'GET /api/dashboard/recent',
        full: 'GET /api/dashboard/full'
      }
    },
    default_admin: {
      email: 'admin@finance.com',
      password: 'admin123'
    },
    health: 'GET /health',
    swagger: 'GET /api-docs'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await db.connect();
    console.log(`✅ Database connected (${process.env.DB_TYPE || 'sqlite'})`);
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`🔑 Default Admin: admin@finance.com / admin123`);
      console.log(`\n📖 Interactive API documentation available at /api-docs\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;