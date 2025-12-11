import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride } }); // Updated navigate to include ride data
  });

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (!value.trim()) {
      setPickupSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: {
            input: value,
            type: "address",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && Array.isArray(response.data)) {
        setPickupSuggestions(response.data);
      } else {
        setPickupSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
      setPickupSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (!value.trim()) {
      setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: {
            input: value,
            type: "address",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && Array.isArray(response.data)) {
        setDestinationSuggestions(response.data);
      } else {
        setDestinationSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
      setDestinationSuggestions([]);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setFare(response.data);
  }

  async function createRide() {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Logo Section */}
      {/* <div className="absolute left-5 top-5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
          SmartRide
        </h1>
      </div> */}
      <div
        className="absolute left-5 top-5 flex items-center gap-3 
     bg-white/10 backdrop-blur-md px-4 py-1 rounded-xl shadow-md z-[50]"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r 
      from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent 
      drop-shadow-lg"
        >
          SmartRide
        </h1>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="text-white text-2xl hover:text-red-400 transition"
        >
          <i className="ri-logout-box-r-line"></i>
        </button>
      </div>

      <div className="h-screen w-screen">
        <LiveTracking pickup={pickup} destination={destination} />
      </div>

      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none">
        <div className="lg:h-[36%] p-6 bg-white relative pointer-events-auto sm:h-[33%]">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <Link
            to="/ride-history"
            className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-black transition"
          >
            <i className="ri-history-line text-xl"></i>
            <span>Ride History</span>
          </Link>

          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="bg-white h-0 pointer-events-auto">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        // className="fixed w-full z-[15] bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-xl rounded-t-2xl"
        className="fixed w-full z-[15] bottom-0 translate-y-full 
             bg-white px-4 py-6 pt-12 
             shadow-xl rounded-t-2xl
             max-h-[85vh] overflow-y-auto
             scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <VehiclePanel
          fare={fare}
          setVehiclePanel={setVehiclePanel}
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        // className="fixed w-full z-[20] -bottom-5 translate-y-full bg-white px-3 py-6 pt-12 shadow-xl rounded-t-2xl"
        className="fixed w-full z-[20] bottom-0 translate-y-full 
             bg-white px-4 py-6 pt-12 
             shadow-xl rounded-t-2xl
             max-h-[85vh] overflow-y-auto
             scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        // className="fixed w-full z-[25] -bottom-5 translate-y-full bg-white px-3 py-6 pt-12 shadow-xl rounded-t-2xl"
        className="fixed w-full z-[25] bottom-0 translate-y-full 
             bg-white px-4 py-6 pt-12 
             shadow-xl rounded-t-2xl
             max-h-[85vh] overflow-y-auto
             scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        // className="fixed w-full z-[30] bottom-0 translate-y-full bg-white px-3 py-6 pt-12 shadow-xl rounded-t-2xl"
        className="fixed w-full z-[30] bottom-0 translate-y-full 
             bg-white px-4 py-6 pt-12 
             shadow-xl rounded-t-2xl
             max-h-[85vh] overflow-y-auto
             scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
