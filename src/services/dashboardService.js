const db = require('../config/database');

class DashboardService {
  async getSummary(userId, filters = {}) {
    let query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE 1=1
    `;
    const params = [];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }
    
    const result = await db.query(query, params);
    const summary = result[0] || { total_income: 0, total_expenses: 0, transaction_count: 0 };
    
    return {
      total_income: parseFloat(summary.total_income || 0),
      total_expenses: parseFloat(summary.total_expenses || 0),
      net_balance: parseFloat((summary.total_income || 0) - (summary.total_expenses || 0)),
      transaction_count: summary.transaction_count || 0
    };
  }

  async getCategoryTotals(userId, filters = {}) {
    let query = `
      SELECT 
        type,
        category,
        SUM(amount) as total
      FROM transactions
      WHERE 1=1
    `;
    const params = [];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }
    
    query += ' GROUP BY type, category ORDER BY type, total DESC';
    
    const results = await db.query(query, params);
    
    const categories = {
      income: {},
      expense: {}
    };
    
    for (const row of results) {
      categories[row.type][row.category] = parseFloat(row.total);
    }
    
    return categories;
  }

  async getMonthlyTrends(userId, months = 6) {
    let query = `
      SELECT 
        strftime('%Y-%m', date) as month,
        type,
        SUM(amount) as total
      FROM transactions
      WHERE date >= date('now', ?)
    `;
    const params = [`-${months} months`];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    query += ' GROUP BY month, type ORDER BY month';
    
    const results = await db.query(query, params);
    
    const trends = {};
    for (const row of results) {
      if (!trends[row.month]) {
        trends[row.month] = { month: row.month, income: 0, expense: 0 };
      }
      trends[row.month][row.type] = parseFloat(row.total);
    }
    
    return Object.values(trends);
  }

  async getRecentActivity(userId, limit = 10) {
    let query = `
      SELECT 
        t.id,
        t.amount,
        t.type,
        t.category,
        t.date,
        t.description,
        u.name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (userId) {
      query += ' AND t.user_id = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY t.created_at DESC LIMIT ?';
    params.push(limit);
    
    const activities = await db.query(query, params);
    
    return activities.map(activity => ({
      ...activity,
      amount: parseFloat(activity.amount)
    }));
  }
}

module.exports = new DashboardService();