import { useEffect, useState } from "react";
import axios from "axios";

const RideHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setHistory(res.data);
        setError(null);
      } catch (error) {
        console.error("Error loading history:", error);
        setError("Failed to load ride history. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = date.toDateString();
    const todayOnly = today.toDateString();
    const yesterdayOnly = yesterday.toDateString();

    if (dateOnly === todayOnly) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (dateOnly === yesterdayOnly) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Shorten address helper
  const shortenAddress = (address) => {
    const parts = address.split(",");
    return parts.slice(0, 2).join(",").trim();
  };

  // Get vehicle icon
  const getVehicleIcon = (type) => {
    switch (type) {
      case "car":
        return "ri-car-fill";
      case "moto":
        return "ri-motorbike-fill";
      case "auto":
        return "ri-taxi-fill";
      default:
        return "ri-car-fill";
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-white/30 rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="max-w-4xl mx-auto px-4 -mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-fill text-red-600 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 pb-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-history-line"></i>
            Ride History
          </h1>
          <p className="text-white/90 text-sm">
            {history.length} {history.length === 1 ? "ride" : "rides"} completed
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* Empty State */}
        {history.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-car-line text-gray-400 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Rides Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Your completed rides will appear here
            </p>
            <button
              onClick={() => (window.location.href = "/home")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              Book Your First Ride
            </button>
          </div>
        )}

        {/* Ride Cards */}
        <div className="space-y-4">
          {history.map((ride) => (
            <div
              key={ride._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Vehicle Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <i
                        className={`${getVehicleIcon(
                          ride.captain?.vehicle.vehicleType
                        )} text-white text-xl`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 capitalize">
                        {ride.captain?.fullname.firstname}{" "}
                        {ride.captain?.fullname.lastname}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {ride.captain?.vehicle.name} •{" "}
                        {ride.captain?.vehicle.plate}
                      </p>
                    </div>
                  </div>

                  {/* Fare Badge */}
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      ${ride.fare}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-4">
                {/* Route */}
                <div className="space-y-3 mb-4">
                  {/* Pickup */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        PICKUP
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {shortenAddress(ride.pickup)}
                      </p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        DESTINATION
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {shortenAddress(ride.destination)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <i className="ri-time-line text-lg"></i>
                    <span className="text-xs font-medium">
                      {formatDate(ride.createdAt)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {ride.status === "completed" && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <i className="ri-check-double-line"></i>
                        Completed
                      </span>
                    )}
                    {ride.captain?.rating && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <i className="ri-star-fill"></i>
                        {ride.captain.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;
