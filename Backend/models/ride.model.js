const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum : ['pending', 'accepted', 'completed','ongoing', 'cancelled'],
    default: 'pending',
  },
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain',
  },
  fare: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
  },
  time: {
    type: Number,
  },
  paymentId: {
    type: String,
    enum : ['cash', 'card'],
    default: 'cash',
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },
  otp: {
    type: Number,
    required: true,
  }
}, { timestamps: true });


const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;