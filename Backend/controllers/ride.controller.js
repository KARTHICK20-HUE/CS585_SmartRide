const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("./../services/maps.service");
const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");
const captainModel = require("../models/captain.model");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    // Create ride
    const ride = await rideService.createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType
    );

    // Send ride response early to avoid "headers already sent" error
    res.status(201).json(ride);

    // Get pickup coordinates
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

    // Find nearby captains
    const captainsInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      6,
      vehicleType
    );

    console.log("Captains in radius:", captainsInRadius);

    // Filter by vehicleType + captain status
    const filteredCaptains = captainsInRadius.filter(
      (captain) =>
        captain.status === "online" &&
        captain.vehicle.vehicleType === vehicleType
    );

    console.log("Filtered captains:", filteredCaptains);

    if (filteredCaptains.length === 0) {
      console.log("No captains available in area.");
      return;
    }

    // Fetch ride with populated user data
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    if (!rideWithUser || !rideWithUser.user) {
      console.warn(
        "Ride or associated user not found. Skipping notifications."
      );
      return;
    }

    //  Get distance & time between pickup and destination
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    // Attach distance + duration to the object we send to captain
    rideWithUser._doc.distance = {
      text: distanceTime.distance.text, // "8.6 km"
      value: distanceTime.distance.value, // 8635 (meters)
    };
    rideWithUser._doc.duration = {
      text: distanceTime.duration.text, // "19 mins"
      value: distanceTime.duration.value, // 1141 (seconds)
    };

    // Strip OTP for frontend
    rideWithUser.otp = "";

    // Notify nearby captains
    filteredCaptains.forEach((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (error) {
    console.error("Error in createRide:", error);
    // Note: Response already sent above; don't send another here.
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getRideHistory = async (req, res) => {
  try {
    const rides = await rideModel
      .find({ user: req.user._id, status: "completed" })
      .populate("captain")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(rides);
  } catch (error) {
    console.error("History fetch failed:", error);
    res.status(500).json({ message: "Unable to fetch ride history" });
  }
};

module.exports.getCaptainLocation = async (req, res) => {
  try {
    const ride = await rideModel
      .findById(req.params.rideId)
      .populate("captain");

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (!ride.captain.location)
      return res.status(200).json({ ltd: null, lng: null });

    res.json(ride.captain.location);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.rateCaptain = async (req, res) => {
  try {
    const { rideId, rating, feedback } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "Ride id is required" });
    }

    // Fetch Ride + captain
    const ride = await rideModel.findById(rideId).populate("captain");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Save feedback on the ride
    await rideModel.findByIdAndUpdate(rideId, { feedback });

    // Rating optional — only update when user submits rating
    if (rating !== undefined && rating !== null) {
      const captain = ride.captain;

      const newTotalRating = captain.totalRating + rating;
      const newCount = (captain.ratingCount || 0) + 1;
      const avgRating = newTotalRating / newCount;

      await captainModel.findByIdAndUpdate(captain._id, {
        totalRating: newTotalRating,
        ratingCount: newCount,
        rating: avgRating,
      });
    }

    return res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.log("Rate Captain Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
