const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ email, password, firstName, lastName ,color, plate, capacity  ,type , status, location })=> {
  if (!email || !password || !firstName || !color || !plate || !capacity || !type) {
    return res.status(400).send({ message: 'Please provide all required fields' });
  }
  const captain = new captainModel({ email, password, fullName: { firstName, lastName }, vehicle: { color, plate, capacity, type } , status , location });
  captain.save();
  return captain;
}