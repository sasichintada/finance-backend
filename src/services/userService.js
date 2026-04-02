const bcrypt = require('bcryptjs');
const db = require('../config/database');

class UserService {
  async createUser(userData) {
    const { email, password, name, role = 'viewer' } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, role, status) 
       VALUES (?, ?, ?, ?, 'active')`,
      [email, hashedPassword, name, role]
    );
    
    return { id: result.lastID, email, name, role, status: 'active' };
  }

  async getUsers(filters = {}) {
    let query = 'SELECT id, email, name, role, status, created_at FROM users';
    const params = [];
    
    if (filters.role) {
      query += ' WHERE role = ?';
      params.push(filters.role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    return await db.query(query, params);
  }

  async getUserById(id) {
    const users = await db.query(
      'SELECT id, email, name, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    return users[0];
  }

  async updateUser(id, updates) {
    const allowedUpdates = ['name', 'role', 'status'];
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
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    return this.getUserById(id);
  }

  async deleteUser(id) {
    await db.query(
      "UPDATE users SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );
    
    return { message: 'User deactivated successfully' };
  }
}

module.exports = new UserService();