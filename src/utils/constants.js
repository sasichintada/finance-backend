const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin'
};

const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: {
    canViewTransactions: true,
    canCreateTransaction: false,
    canUpdateTransaction: false,
    canDeleteTransaction: false,
    canViewDashboard: true,
    canManageUsers: false
  },
  [ROLES.ANALYST]: {
    canViewTransactions: true,
    canCreateTransaction: true,
    canUpdateTransaction: true,
    canDeleteTransaction: true,
    canViewDashboard: true,
    canManageUsers: false
  },
  [ROLES.ADMIN]: {
    canViewTransactions: true,
    canCreateTransaction: true,
    canUpdateTransaction: true,
    canDeleteTransaction: true,
    canViewDashboard: true,
    canManageUsers: true
  }
};

const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  EXPENSE: ['Food', 'Transport', 'Utilities', 'Rent', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
  TRANSACTION_TYPES,
  CATEGORIES
};