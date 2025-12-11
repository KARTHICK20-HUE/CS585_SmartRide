import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const captainData = {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email,
        password,
        vehicle: {
          name: vehicleName,
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data.message || err.response.data.error;

        if (status === 400) {
          if (message.includes("email")) {
            setError("This email is already registered. Please login instead.");
          } else if (message.includes("password")) {
            setError("Password must be at least 6 characters long.");
          } else if (message.includes("vehicle")) {
            setError("Please provide valid vehicle information.");
          } else if (message.includes("plate")) {
            setError("This vehicle plate is already registered.");
          } else {
            setError(message || "Please check your information and try again.");
          }
        } else if (status === 409) {
          setError(
            "This email is already registered as captain. Please login."
          );
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(message || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Captain signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 px-5 min-h-screen flex flex-col justify-between">
      <div>
        {/* Logo Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-black relative">
              SmartRide
              <sup className="ml-1 text-xs md:text-sm bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold px-2 py-0.5 rounded shadow-md align-top">
                Captain
              </sup>
            </h1>
          </div>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <i className="ri-steering-2-fill text-blue-600"></i>
            Register to start earning as a captain
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-fill text-red-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold text-sm mb-1">
                Registration Failed
              </h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Name Fields */}
          <div>
            <label className="text-base font-medium text-gray-700 mb-2 block">
              Captain&apos;s Full Name
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  required
                  className={`bg-gray-100 rounded-lg px-4 py-2.5 pl-10 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    error ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />
                <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              </div>
              <div className="relative flex-1">
                <input
                  required
                  className={`bg-gray-100 rounded-lg px-4 py-2.5 pl-10 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    error ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />
                <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-base font-medium text-gray-700 mb-2 block">
              Captain&apos;s Email
            </label>
            <div className="relative">
              <input
                required
                className={`bg-gray-100 rounded-lg px-4 py-2.5 pl-10 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="email"
                placeholder="captain@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
              <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-base font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                required
                className={`bg-gray-100 rounded-lg px-4 py-2.5 pl-10 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                minLength="6"
              />
              <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Vehicle Section Header */}
          <div className="pt-3 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="ri-car-fill text-blue-600"></i>
              Vehicle Information
            </h3>
          </div>

          {/* Vehicle Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Vehicle Model
            </label>
            <div className="relative">
              <input
                required
                className={`bg-gray-100 rounded-lg px-4 py-2.5 pl-10 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="text"
                placeholder="e.g., Honda City, Maruti Swift"
                value={vehicleName}
                onChange={(e) => {
                  setVehicleName(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
              <i className="ri-car-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>
          </div>

          {/* Color and Plate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color
              </label>
              <input
                required
                className={`bg-gray-100 rounded-lg px-3 py-2.5 border-2 w-full text-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="text"
                placeholder="White, Black..."
                value={vehicleColor}
                onChange={(e) => {
                  setVehicleColor(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Plate Number
              </label>
              <input
                required
                className={`bg-gray-100 rounded-lg px-3 py-2.5 border-2 w-full text-sm placeholder:text-gray-400 uppercase transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="text"
                placeholder="DL01AB1234"
                value={vehiclePlate}
                onChange={(e) => {
                  setVehiclePlate(e.target.value.toUpperCase());
                  setError("");
                }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Capacity and Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Capacity
              </label>
              <input
                required
                className={`bg-gray-100 rounded-lg px-3 py-2.5 border-2 w-full text-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="number"
                min="1"
                max="10"
                placeholder="4"
                value={vehicleCapacity}
                onChange={(e) => {
                  setVehicleCapacity(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vehicle Type
              </label>
              <select
                required
                className={`bg-gray-100 rounded-lg px-3 py-2.5 border-2 w-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                value={vehicleType}
                onChange={(e) => {
                  setVehicleType(e.target.value);
                  setError("");
                }}
                disabled={loading}
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="car">🚗 Car</option>
                <option value="auto">🛺 Auto</option>
                <option value="moto">🏍️ Motorcycle</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-3 rounded-lg text-base w-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <i className="ri-steering-2-fill text-xl"></i>
                <span>Create Captain Account</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-5 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/captain-login"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Terms & Privacy */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs leading-relaxed text-gray-500 text-center">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          . This site is protected by reCAPTCHA.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
