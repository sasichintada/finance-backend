const transactionService = require('../services/transactionService');

class TransactionController {
  async createTransaction(req, res, next) {
    try {
      const userId = req.user.userId;
      const transaction = await transactionService.createTransaction(userId, req.body);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      const userId = req.user.userId;
      const isAdmin = req.user.role === 'admin';
      
      const filters = {
        ...req.query,
        viewAll: isAdmin && req.query.viewAll === 'true'
      };
      
      const result = await transactionService.getTransactions(
        isAdmin && filters.viewAll ? null : userId,
        filters
      );
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req, res, next) {
    try {
      const transaction = await transactionService.getTransactionById(parseInt(req.params.id));
      
      if (req.user.role !== 'admin' && transaction.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(transaction);
    } catch (error) {
      if (error.message === 'Transaction not found') {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async updateTransaction(req, res, next) {
    try {
      const transaction = await transactionService.updateTransaction(
        parseInt(req.params.id),
        req.user.userId,
        req.user.role === 'admin',
        req.body
      );
      res.json(transaction);
    } catch (error) {
      if (error.message === 'Transaction not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'You can only update your own transactions') {
        res.status(403).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async deleteTransaction(req, res, next) {
    try {
      const result = await transactionService.deleteTransaction(
        parseInt(req.params.id),
        req.user.userId,
        req.user.role === 'admin'
      );
      res.json(result);
    } catch (error) {
      if (error.message === 'Transaction not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'You can only delete your own transactions') {
        res.status(403).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = new TransactionController();