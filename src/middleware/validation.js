const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

const userValidation = {
  create: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    body('role').optional().isIn(['viewer', 'analyst', 'admin']),
    validate
  ],
  update: [
    param('id').isInt(),
    body('name').optional().trim(),
    body('role').optional().isIn(['viewer', 'analyst', 'admin']),
    body('status').optional().isIn(['active', 'inactive']),
    validate
  ]
};

const transactionValidation = {
  create: [
    body('amount').isFloat({ min: 0.01 }),
    body('type').isIn(['income', 'expense']),
    body('category').notEmpty().trim(),
    body('date').isISO8601(),
    body('description').optional().trim().isLength({ max: 500 }),
    validate
  ],
  update: [
    param('id').isInt(),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().notEmpty(),
    body('date').optional().isISO8601(),
    body('description').optional().trim(),
    validate
  ],
  filters: [
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate
  ]
};

module.exports = { userValidation, transactionValidation };