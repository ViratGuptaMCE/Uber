const captainModel = require('../models/captain.model');
const validationResult = require('express-validator').validationResult;
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerCaptain = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }
  const { email, password, fullName, vehicle , status , location } = req.body;

  const isCaptainExist = await captainModel.findOne({ email });

  if(isCaptainExist) {
    return res.status(400).json({ message: 'Captain already exist' });
  }
  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    email,
    password: hashedPassword,
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    status,
    location,
    ...vehicle,
  });
  const token = captain.generateAuthToken();
  res.status(201).json({ captain, token });
}

module.exports.loginCaptain = async (req, res) => { 
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select('+password');
  if (!captain) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = captain.generateAuthToken();
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ captain, token });
}

module.exports.getProfile = async (req, res) => {
  res.status(200).json(req.captain);
}

module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token;
  const blackListToken = new blackListTokenModel({ token });
  blackListToken.save();
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successfully' });
}