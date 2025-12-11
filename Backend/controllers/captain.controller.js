const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle } = req.body;
  const IsCaptainAlradyExist = await captainModel.findOne({ email });
  if (IsCaptainAlradyExist) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const hashPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    vehicleName: vehicle.name,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  await captain.save();

  const token = captain.generateAuthToken();
  res.status(201).json({ captain, token });
};

module.exports.loginCaptain = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Fix: Call comparePassword on captain instance, not model
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Remove password from response
    captain.password = undefined;
    res.status(200).json({ captain, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.getCaptainProfile = async (req, res) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.updateCaptainStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["online", "offline", "busy"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const captain = await captainModel.findByIdAndUpdate(
      req.captain._id,
      { status },
      { new: true }
    );

    res.status(200).json({ captain });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
};

module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListTokenModel.create({ token });
  // mark captain offline
  await captainModel.findByIdAndUpdate(req.captain._id, { status: "offline" });
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
