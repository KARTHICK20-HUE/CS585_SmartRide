import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";
// import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  // const [distance, setDistance] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;
  const { socket } = useContext(SocketContext);

  function kmToMiles(kmText) {
  const km = parseFloat(kmText);
  if (isNaN(km)) return "";
  return (km * 0.621371).toFixed(2); // miles
}

  const rideRef = useRef(rideData);
  useEffect(() => {
    rideRef.current = rideData;
  }, [rideData]);

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  // useEffect(() => {
  //   console.log("Ride Data:", rideData);
  //   const handler = (data) => {
  //     // console.log("🔥 RECEIVED Socket:", data);
  //     if (data.captainId?.toString() === rideData?.captain?._id?.toString()) {
  //       setCaptainLocation(data.location);
  //       updateDistanceTime(data.location);
  //     }
  //   };

  //   socket.on("captain-location-updated", handler);
  //   return () => socket.off("captain-location-updated", handler);
  // }, [socket, rideData]);
  useEffect(() => {
    console.log("Ride Data:", rideData);
    const handler = (data) => {
      const currentRide = rideRef.current;
      if (!currentRide) return;

      if (
        data.captainId?.toString() === currentRide?.captain?._id?.toString()
      ) {
        setCaptainLocation(data.location);
        // updateDistanceTime(data.location);
      }
    };

    socket.on("captain-location-updated", handler);

    return () => socket.off("captain-location-updated", handler);
  }, [socket]);

  // async function updateDistanceTime(captainLoc) {
  //   // console.log("🔥 RECEIVED:", captainLoc);
  //   try {
  //     const lat = captainLoc.ltd;
  //     const lng = captainLoc.lng;

  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`,
  //       {
  //         params: {
  //           origin: `${lat},${lng}`,
  //           destination: rideData.destination,
  //         },
  //       }
  //     );

  //     // setDistance(res.data);
  //   } catch (err) {
  //     console.error("Distance fetch failed", err);
  //   }
  // }

  return (
    <div className="h-screen relative flex flex-col">
      {/* MAP AT THE BOTTOM - FULL SCREEN */}
      <div className="absolute inset-0 z-0">
        <LiveTracking
          pickup={rideData?.pickup}
          destination={rideData?.destination}
          captainLocation={captainLocation}
          vehicleType={rideData?.vehicleType}
        />
      </div>

      {/* TOP HEADER */}
      <div className="fixed top-0 left-0 w-full z-20 bg-white p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-bold text-black relative">
            SmartRide
            <sup className="ml-1 text-xs md:text-sm bg-yellow-400 text-black font-medium px-1 rounded">
              Captain
            </sup>
          </h1>
        </div>
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow"
        >
          <i className="text-lg ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* RIDE SUMMARY PANEL */}
      <div
        className="absolute bottom-0 left-0 w-full z-30 bg-yellow-400 p-6 pt-10 rounded-t-3xl cursor-pointer"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="p-1 text-center absolute w-[90%] top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold">
              {kmToMiles(rideData.distance.text)} miles
            </h4>
            <p className="text-md text-gray-600">
              {/* {distance ? distance.duration.text : ""} */}
              {rideData.duration.text}
            </p>
          </div>

          <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
            Complete Ride
          </button>
        </div>
      </div>

      {/* FINISH RIDE POPUP */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[50] bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-xl"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
