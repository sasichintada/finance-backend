const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials' || error.message === 'Account is inactive') {
        res.status(401).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = new AuthController();