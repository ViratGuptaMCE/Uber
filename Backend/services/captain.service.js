const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ email, password, firstName, lastName ,color, plate, capacity  ,type  })=> {
  if (!email || !password || !firstName || !color || !plate || !capacity || !type) {
    throw console.error('Please provide all required fields');
  }
  const captain = new captainModel({ email, password, fullName: { firstName, lastName }, vehicle: { color, plate, capacity, type } });
  captain.save();
  console.log("Captain saved");
  return captain;
}