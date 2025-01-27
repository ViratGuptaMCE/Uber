const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Invalid input');
  }
  try {
    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    console.log("fine 1 ",distanceTime);
    const { distance, duration } = distanceTime;
    let time, tmUnit, dist, distUnit;
    time = duration.split(" ")[0];
    tmUnit = duration.split(" ")[1];
    dist = distance.split(" ")[0];
    distUnit = distance.split(" ")[1];
    let fare = 30;
    console.log("fine 2");
    
    if (distUnit === 'km') {
      fare += dist * 10; 
    } else if (distUnit === "m") {
      fare += (dist / 1000) * 10;
    }
    
    if (tmUnit === 'min') {
      fare += time * 2; 
    } else if (tmUnit === 'hrs') {
      fare += time * 60 * 2; 
    } else if (tmUnit === 'days') {
      fare += time * 24 * 60 * 2; 
    }
    console.log("fine 3");
    const fareObj = {
      auto: fare,
      bike: fare * 0.75,
      car: fare * 1.5
    }
    
    console.log("fine 4");
    return fareObj;
  }
  catch (err) {
    throw new Error('Distance not found Sorry');
  }
}

function getOTP(num) {
  return Math.floor(10 ** num + Math.random() * 9 * (10 ** num));
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error('Invalid input');
  }
  const fare = await getFare(pickup, destination);
  const ride = rideModel.create({
    userId: user._id,
    pickup,
    destination,
    fare: fare[vehicleType],
    otp : getOTP(6)
  });
  return ride;
}

module.exports.getFare = getFare;