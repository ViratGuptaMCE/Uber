const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controller/ride.controller');
const authMiddleware = require('../middleware/auth');

router.post('/create',
  authMiddleware.authUser,
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid Origin'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid Destination'),
  body('vehicleType').isString().isIn(['auto', 'bike', 'car']).withMessage('Invalid Vehicle Type'), rideController.createRide
);

module.exports = router;