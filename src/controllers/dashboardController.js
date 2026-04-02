const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const userId = req.user.role === 'admin' && req.query.viewAll === 'true' 
        ? null 
        : req.user.userId;
      
      const summary = await dashboardService.getSummary(userId, req.query);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryTotals(req, res, next) {
    try {
      const userId = req.user.role === 'admin' && req.query.viewAll === 'true'
        ? null
        : req.user.userId;
      
      const categories = await dashboardService.getCategoryTotals(userId, req.query);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyTrends(req, res, next) {
    try {
      const userId = req.user.role === 'admin' && req.query.viewAll === 'true'
        ? null
        : req.user.userId;
      
      const months = parseInt(req.query.months) || 6;
      const trends = await dashboardService.getMonthlyTrends(userId, months);
      res.json(trends);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req, res, next) {
    try {
      const userId = req.user.role === 'admin' && req.query.viewAll === 'true'
        ? null
        : req.user.userId;
      
      const limit = parseInt(req.query.limit) || 10;
      const activities = await dashboardService.getRecentActivity(userId, limit);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  async getFullDashboard(req, res, next) {
    try {
      const userId = req.user.role === 'admin' && req.query.viewAll === 'true'
        ? null
        : req.user.userId;
      
      const [summary, categories, trends, recent] = await Promise.all([
        dashboardService.getSummary(userId, req.query),
        dashboardService.getCategoryTotals(userId, req.query),
        dashboardService.getMonthlyTrends(userId, parseInt(req.query.months) || 6),
        dashboardService.getRecentActivity(userId, parseInt(req.query.limit) || 10)
      ]);
      
      res.json({
        summary,
        categories,
        trends,
        recent_activity: recent
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();