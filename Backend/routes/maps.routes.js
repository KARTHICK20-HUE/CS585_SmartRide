const express = require("express");
const router = express.Router();
const mapController = require("../controllers/maps.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { query } = require("express-validator");

router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapController.getCoordinates
);

router.get("/get-distance-time", mapController.getDistanceTime);

router.get(
  "/get-suggestions",
  [
    query("input")
      .trim()
      .notEmpty()
      .withMessage("Input is required")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Input must be at least 3 characters long"),
  ],
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions
);

module.exports = router;
