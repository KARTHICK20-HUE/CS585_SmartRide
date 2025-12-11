const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, {
          socketId: socket.id,
          status: "online",
        });
        console.log(
          `Captain connected: ${userId} with socket ID: ${socket.id}`
        );
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (
        !location ||
        location.ltd === undefined ||
        location.lng === undefined
      ) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      // 1. Update captain location in DB
      const captain = await captainModel.findByIdAndUpdate(
        userId,
        {
          location: {
            ltd: location.ltd,
            lng: location.lng,
          },
        },
        { new: true }
      );

      if (!captain) return;

      // 2. Find ongoing ride (accepted or ongoing)
      const activeRide = await require("./models/ride.model")
        .findOne({
          captain: userId,
          status: { $in: ["accepted", "ongoing"] },
        })
        .populate("user");

      if (!activeRide || !activeRide.user || !activeRide.user.socketId) {
        // console.log("No active ride found for captain:", userId);
        return; // no active ride → no need to update user
      }

      const payload = {
        captainId: userId,
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      };

      // send to user
      io.to(activeRide.user.socketId).emit("captain-location-updated", payload);

      // send to captain
      if (captain.socketId) {
        io.to(captain.socketId).emit("captain-location-updated", payload);
      }
    });

    socket.on("disconnect", async () => {
      await captainModel.findOneAndUpdate(
        { socketId: socket.id },
        { status: "offline" }
      );
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  // console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
