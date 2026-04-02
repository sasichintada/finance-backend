const db = require('../config/database');

class TransactionService {
  async createTransaction(userId, transactionData) {
    const { amount, type, category, date, description } = transactionData;
    
    const result = await db.query(
      `INSERT INTO transactions (user_id, amount, type, category, date, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, amount, type, category, date, description || null]
    );
    
    return this.getTransactionById(result.lastID);
  }

  async getTransactionById(id) {
    const transactions = await db.query(
      `SELECT t.*, u.name as user_name 
       FROM transactions t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [id]
    );
    
    if (transactions.length === 0) {
      throw new Error('Transaction not found');
    }
    
    return transactions[0];
  }

  async getTransactions(userId, filters = {}) {
    let query = `
      SELECT t.*, u.name as user_name 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (userId && !filters.viewAll) {
      query += ' AND t.user_id = ?';
      params.push(userId);
    }
    
    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }
    
    if (filters.category) {
      query += ' AND t.category = ?';
      params.push(filters.category);
    }
    
    if (filters.startDate) {
      query += ' AND t.date >= ?';
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ' AND t.date <= ?';
      params.push(filters.endDate);
    }
    
    query += ' ORDER BY t.date DESC, t.created_at DESC';
    
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const transactions = await db.query(query, params);
    
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM transactions t 
      WHERE 1=1
    `;
    const countParams = [];
    
    if (userId && !filters.viewAll) {
      countQuery += ' AND t.user_id = ?';
      countParams.push(userId);
    }
    
    if (filters.type) {
      countQuery += ' AND t.type = ?';
      countParams.push(filters.type);
    }
    
    if (filters.category) {
      countQuery += ' AND t.category = ?';
      countParams.push(filters.category);
    }
    
    const totalResult = await db.query(countQuery, countParams);
    
    return {
      transactions,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.total || 0,
        pages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    };
  }

  async updateTransaction(id, userId, isAdmin, updates) {
    const transaction = await this.getTransactionById(id);
    
    if (!isAdmin && transaction.user_id !== userId) {
      throw new Error('You can only update your own transactions');
    }
    
    const allowedUpdates = ['amount', 'type', 'category', 'date', 'description'];
    const updateFields = [];
    const params = [];
    
    for (const field of allowedUpdates) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(updates[field]);
      }
    }
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    await db.query(
      `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    return this.getTransactionById(id);
  }

  async deleteTransaction(id, userId, isAdmin) {
    const transaction = await this.getTransactionById(id);
    
    if (!isAdmin && transaction.user_id !== userId) {
      throw new Error('You can only delete your own transactions');
    }
    
    await db.query('DELETE FROM transactions WHERE id = ?', [id]);
    
    return { message: 'Transaction deleted successfully' };
  }
}

module.exports = new TransactionService();