const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ message: err.array() });
  }
  const { pickup, destination, vehicleType } = req.body;
  try {
    const ride = await rideService.createRide({ user : req.user._id, pickup, destination, vehicleType });
    res.status(200).json(ride);
  } catch (err) {
    console.log("error");
    res.status(400).json({ message: err.message });
  }
}