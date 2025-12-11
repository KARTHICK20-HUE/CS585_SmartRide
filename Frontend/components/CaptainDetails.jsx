import { useContext, useState } from "react";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);

  const statusConfig = {
    online: {
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      icon: "ri-checkbox-circle-fill",
      label: "Online",
      description: "Available for rides",
    },
    offline: {
      color: "bg-gray-500",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      icon: "ri-close-circle-fill",
      label: "Offline",
      description: "Not accepting rides",
    },
    busy: {
      color: "bg-orange-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      icon: "ri-steering-2-fill",
      label: "On Ride",
      description: "Currently busy",
    },
  };

  // const currentStatus = statusConfig[captain.status];
  const normalize = {
    active: "online",
    inactive: "offline",
    onride: "busy",
  };

  const safeStatus = normalize[captain.status] || captain.status;
  const currentStatus = statusConfig[safeStatus];

  // 🔥 Update Status API Handler
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/captains/update-status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setCaptain((prev) => ({ ...prev, status: newStatus }));
        setShowStatusMenu(false);
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          {/* Profile Image with Status Dot */}
          <div className="relative">
            <img
              className="h-14 w-14 rounded-full object-cover border-2 border-gray-300"
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              alt="driver profile"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 ${currentStatus.color} border-2 border-white rounded-full`}
            ></div>
          </div>

          {/* Name + Status */}
          <div>
            <h4 className="text-lg font-medium capitalize">
              {captain.fullname.firstname + " " + captain.fullname.lastname}
            </h4>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <i
                className={`${currentStatus.icon} ${currentStatus.textColor}`}
              ></i>
              {currentStatus.label}
            </p>
          </div>
        </div>

        {/* Earnings */}
        <div className="flex flex-col gap-2 items-end">
          <div className="text-right flex gap-3 items-center">
            <p className="text-sm text-gray-600">Total Earned :</p>
            <h4 className="text-xl font-semibold">$ {captain.earnings || 0}</h4>
          </div>
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`px-3 py-1.5 ${currentStatus.bgColor} ${currentStatus.borderColor} border-2 rounded-lg text-xs font-semibold ${currentStatus.textColor} hover:opacity-80 transition-all flex items-center gap-1`}
            >
              <i className="ri-arrow-down-s-line"></i>
              Status
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(key)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                      captain.status === key ? "bg-gray-50" : ""
                    }`}
                  >
                    <i
                      className={`${config.icon} text-xl ${config.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    ></i>

                    <div>
                      <p className="text-sm font-semibold">{config.label}</p>
                      <p className="text-xs text-gray-500">
                        {config.description}
                      </p>
                    </div>

                    {captain.status === key && (
                      <i className="ri-check-line ml-auto text-green-600"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details Accordion */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setShowVehicleDetails(!showVehicleDetails)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <span className="text-sm font-semibold text-gray-700">
            Vehicle Details
          </span>
          <i
            className={`ri-arrow-down-s-line text-xl transition-transform ${
              showVehicleDetails ? "rotate-180" : ""
            }`}
          ></i>
        </button>

        {/* Content */}
        {showVehicleDetails && (
          <div className="px-4 py-3 bg-white text-sm border-t border-gray-200 space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-500">Vehicle Name</p>
              <p className="font-medium capitalize">{captain.vehicle.name}</p>
            </div>

            {captain.vehicle.model && (
              <div className="flex justify-between">
                <p className="text-gray-500">Model</p>
                <p className="font-medium capitalize">
                  {captain.vehicle.model}
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <p className="text-gray-500">Vehicle Type</p>
              <p className="font-medium capitalize">
                {captain.vehicle.vehicleType}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Color</p>
              <p className="font-medium capitalize">{captain.vehicle.color}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Plate Number</p>
              <p className="font-medium uppercase tracking-wide">
                {captain.vehicle.plate}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Capacity</p>
              <p className="font-medium">{captain.vehicle.capacity} seats</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5">
        <div className="text-center">
          <i className="text-3xl mb-2 ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">3.8</h5>
          <p className="text-sm text-gray-600">Avg Speed</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 ri-booklet-line"></i>
          <h5 className="text-lg font-medium">27</h5>
          <p className="text-sm text-gray-600">Total Rides</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
