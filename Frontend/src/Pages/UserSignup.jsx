/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      // Handle different error types
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data.message || err.response.data.error;

        if (status === 400) {
          if (message.includes("email")) {
            setError("This email is already registered. Please login instead.");
          } else if (message.includes("password")) {
            setError("Password must be at least 6 characters long.");
          } else {
            setError(message || "Please check your information and try again.");
          }
        } else if (status === 409) {
          setError("This email is already registered. Please login instead.");
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

      console.error("Signup error:", err);
    } finally {
      setLoading(false);
      // Don't clear form on error, only on success
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        {/* Logo Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
            SmartRide
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Create your account to get started
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
            <label className="text-lg font-medium text-gray-700 mb-2 block">
              Full Name
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  required
                  className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
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
                <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              </div>
              <div className="relative flex-1">
                <input
                  required
                  className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
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
                <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="text-lg font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="email"
                placeholder="email@example.com"
                disabled={loading}
              />
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-lg font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                type="password"
                placeholder="Create a strong password"
                disabled={loading}
                minLength="6"
              />
              <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center py-3 rounded-lg text-lg w-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
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
                <span>Create Account</span>
                <i className="ri-arrow-right-line text-xl"></i>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Terms & Privacy */}
      <div className="mt-6">
        <p className="text-xs leading-relaxed text-gray-500 text-center">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-orange-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-orange-600 hover:underline">
            Privacy Policy
          </Link>
          . This site is protected by reCAPTCHA.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
