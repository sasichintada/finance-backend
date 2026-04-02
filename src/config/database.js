const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

class Database {
  constructor() {
    this.dbType = process.env.DB_TYPE || 'sqlite';
    this.connection = null;
  }

  async connect() {
    if (this.dbType === 'postgres') {
      this.connection = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
      await this.connection.connect();
      await this.initPostgresTables();
    } else {
      this.connection = new sqlite3.Database(path.join(__dirname, '../../finance.db'));
      await this.initSQLiteTables();
    }
    return this.connection;
  }

  async initSQLiteTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'viewer',
        status TEXT NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS transactions (
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
      )`,
      `CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`,
      `CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)`
    ];

    for (const query of queries) {
      await new Promise((resolve, reject) => {
        this.connection.run(query, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    const bcrypt = require('bcryptjs');
    const adminExists = await new Promise((resolve) => {
      this.connection.get(
        "SELECT id FROM users WHERE email = 'admin@finance.com'",
        (err, row) => resolve(!err && row)
      );
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await new Promise((resolve, reject) => {
        this.connection.run(
          "INSERT INTO users (email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?)",
          ['admin@finance.com', hashedPassword, 'Admin User', 'admin', 'active'],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
  }

  async initPostgresTables() {
    // PostgreSQL implementation - similar to SQLite
  }

  query(sql, params = []) {
    if (this.dbType === 'postgres') {
      return this.connection.query(sql, params);
    } else {
      return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          this.connection.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        } else {
          this.connection.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
          });
        }
      });
    }
  }
}

module.exports = new Database();