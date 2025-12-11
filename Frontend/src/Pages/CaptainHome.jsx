import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            socket.emit("update-location-captain", {
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          },

          (error) => {
            console.error("Location access denied or failed:", error.message);
            alert("Please allow location permission to receive ride requests.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    };

    setInterval(updateLocation, 10000);
    updateLocation();
  }, []);

  socket.on("new-ride", (data) => {
    setRide(data);
    setRidePopupPanel(true);
  });

  async function confirmRide() {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translate(-50%, -50%)",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translate(-50%, 100%)",
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="fixed p-4 md:p-6 top-0 flex items-center justify-between w-full bg-white/80 backdrop-blur-sm z-20">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-bold text-black relative">
            SmartRide
            <sup className="ml-1 text-xs md:text-sm bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold px-2 py-0.5 rounded shadow-md align-top">
              Captain
            </sup>
          </h1>
        </div>

        <Link
          to="/captain-logout"
          className="h-8 w-8 md:h-10 md:w-10 bg-white flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <i className="text-base md:text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:h-screen pt-16 md:pt-20">
        {/* Map Section */}
        <div className="h-[40vh] md:h-full md:w-3/5 lg:w-2/3">
          <LiveTracking />
        </div>

        {/* Captain Details Section */}
        <div className="h-[60vh] md:h-full md:w-2/5 lg:w-1/3 p-4 md:p-6 overflow-y-auto">
          <CaptainDetails />
        </div>
      </div>

      {/* Ride Popup Panel - Mobile: Bottom Sheet, Desktop: Fixed Card */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full md:w-[420px] lg:w-[460px] z-[40] 
                   bottom-0 md:bottom-6 md:right-6 
                   translate-y-full
                   bg-white 
                   px-4 py-6 md:px-6 md:py-8
                   rounded-t-3xl md:rounded-2xl 
                   shadow-2xl
                   max-h-[85vh] md:max-h-[90vh]
                   overflow-y-auto
                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Popup Panel - Centered Modal on All Screens */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-full md:w-auto md:h-auto
                   z-[50]
                   left-1/2 top-1/2
                   -translate-x-1/2 translate-y-full
                   opacity-0
                   bg-white 
                   md:min-w-[500px] md:max-w-[600px]
                   md:max-h-[90vh]
                   px-4 py-6 md:px-6 md:py-8
                   md:rounded-2xl 
                   shadow-2xl
                   overflow-y-auto
                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>

      {/* Backdrop for Confirm Ride Modal */}
      {confirmRidePopupPanel && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm"
          onClick={() => setConfirmRidePopupPanel(false)}
        ></div>
      )}
    </div>
  );
};

export default CaptainHome;
