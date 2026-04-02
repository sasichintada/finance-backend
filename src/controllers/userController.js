const userService = require('../services/userService');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        next(error);
      }
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers(req.query);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = new UserController();