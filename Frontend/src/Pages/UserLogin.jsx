/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const userData = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        console.log(response.data);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (err) {
      // Handle different error types
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data.message || err.response.data.error;

        if (status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (status === 404) {
          setError("Account not found. Please sign up first.");
        } else if (status === 400) {
          setError(message || "Please check your credentials.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(message || "Login failed. Please try again.");
        }
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Login error:", err);
    } finally {
      setLoading(false);
      // Don't clear form on error, only on success
    }
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div className="mb-5">
        {/* Logo Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
            SmartRide
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-fill text-red-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold text-sm mb-1">
                Login Failed
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="text-lg font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error on input change
                }}
                className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                required
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error on input change
                }}
                className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                required
                type="password"
                placeholder="Enter your password"
                disabled={loading}
              />
              <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            </div>
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
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <i className="ri-arrow-right-line text-xl"></i>
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-base">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Captain Login Button */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <Link
          to="/captain-login"
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 flex items-center justify-center text-center py-3 rounded-lg text-lg w-full font-semibold transition-all shadow-lg hover:shadow-xl gap-2"
        >
          <i className="ri-steering-2-fill text-xl"></i>
          <span>Sign in as Captain</span>
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
