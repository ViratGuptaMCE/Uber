const express = require('express');
const router = express.Router();
const captainController = require('../controller/captain.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');

router.post('/register', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  body('fullName.firstName').isLength({ min: 3 }).withMessage('First name should be at least 3 characters'),
  body('vehicle.color').isLength({ min: 3 }).withMessage('Color should be at least 3 characters'),
  body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate should be at least 3 characters'),
  body('vehicle.capacity').isLength({ min: 1 }).withMessage('Capacity should be at least 1'),
  body('vehicle.type').isIn(['car', 'motorcycle', 'auto']),
],
  captainController.registerCaptain
);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
], captainController.loginCaptain);

router.get('/profile', authMiddleware.authCaptain, captainController.getProfile);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;