import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";
import RatingDialog from "../components/RatingDialog";
import axios from "axios";
import vehicleImages from "../utils/vehicleImages";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [captainLocation, setCaptainLocation] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);

function kmToMiles(kmText) {
  const km = parseFloat(kmText);
  if (isNaN(km)) return "";
  return (km * 0.621371).toFixed(2); // miles
}

  //  UPDATE DISTANCE + ETA
  async function updateDistanceTime(captainLoc) {
    if (!captainLoc?.ltd || !captainLoc?.lng) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`,
        {
          params: {
            origin: `${captainLoc.ltd},${captainLoc.lng}`,
            destination: ride.destination,
          },
        }
      );

      setDistance(res.data.distance.text);
      setEta(res.data.duration.text);
    } catch (err) {
      console.error("Distance fetch failed", err);
    }
  }

  useEffect(() => {
    if (!ride?._id) return;

    // 1) Load last saved captain location
    axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/rides/captain-location/${ride._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data?.ltd) {
          const loc = {
            ltd: res.data.ltd,
            lng: res.data.lng,
          };
          setCaptainLocation(loc);

          // 🔥 FIX: Update distance immediately even on reload
          updateDistanceTime(loc);
        }
      });

    // 2) Live updates via socket
    const handler = (data) => {
      setCaptainLocation(data.location);
      updateDistanceTime(data.location);
    };

    socket.on("captain-location-updated", handler);

    return () => socket.off("captain-location-updated", handler);
  }, [ride, socket]);

  // -------------------------------
  //  RIDE ENDED
  // -------------------------------
  useEffect(() => {
    const endHandler = () => setShowRatingDialog(true);

    socket.on("ride-ended", endHandler);
    return () => socket.off("ride-ended", endHandler);
  }, [socket]);

  // -------------------------------
  //  UI
  // -------------------------------
  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      {/* MAP */}
      <div className="h-1/2">
        <LiveTracking
          pickup={ride.pickup}
          destination={ride.destination}
          captainLocation={captainLocation}
          vehicleType={ride.captain.vehicle.vehicleType}
        />
      </div>

      {/* RIDING DETAILS */}
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            className="w-20 h-20 object-contain"
            src={
              vehicleImages[ride.captain.vehicle.vehicleType] ||
              vehicleImages.default
            }
            alt={ride?.vehicleType}
          />

          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain.fullname.firstname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-sm text-gray-600">
              {ride?.captain.vehicle.name}
            </p>
          </div>
        </div>

        {/* DISTANCE + ETA */}
        <div className="mt-4 p-4 bg-yellow-400 rounded-xl text-center">
          <h3 className="text-2xl font-semibold">
            {distance
    ? `${kmToMiles(distance)} miles`
    : "Calculating..."
  }
          </h3>
          <p className="text-md text-gray-700">{eta || ""}</p>
        </div>

        {/* DEST + FARE */}
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">${ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <button
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
          onClick={() => setShowRatingDialog(true)}
        >
          Make a Payment
        </button>
      </div>

      {/* RATING POPUP */}
      <RatingDialog
        open={showRatingDialog}
        setOpen={setShowRatingDialog}
        ride={ride}
        onSubmit={() => navigate("/home")}
        onSkip={() => navigate("/home")}
      />
    </div>
  );
};

export default Riding;
