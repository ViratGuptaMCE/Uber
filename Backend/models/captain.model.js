const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'First name should be at least 3 characters'],
    },
    lastName: {
      type: String,
      minlength: [3, 'Last name should be at least 3 characters'],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, 'Password should be at least 6 characters'],
  },
  socketId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'Color should be at least 3 characters'],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'Plate should be at least 3 characters'],
    },
    capacity: {
      type: Number,
      required: true,
      minlength: [1, 'Capacity should be at least 1'],
    },
    type: {
      type: String,
      required: true,
      enum: ['car', 'motorcycle', 'auto'],
    },
  },
  location: {
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    }
  }
});

captainSchema.methods.generateAuthToken = function () {
  const captain = this;
  const token = jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
}

captainSchema.methods.comparePassword = async function (password) {
  const captain = this;
  return await bcrypt.compare(password, captain.password);
}

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('Captain', captainSchema);

module.exports = captainModel;