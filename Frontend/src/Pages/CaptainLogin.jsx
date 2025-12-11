// import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { CaptainDataContext } from "../context/CaptainContext";
// import axios from "axios";

// const CaptainLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const { setCaptain } = useContext(CaptainDataContext);

//   // useEffect(() => {
//   //   console.log(captainData); // Logs whenever userData updates
//   // }, [captainData]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const captain = {
//       email: email,
//       password: password,
//     };
//     const response = await axios.post(
//       `${import.meta.env.VITE_BASE_URL}/captains/login`,
//       captain
//     );
//     if (response.status === 200) {
//       const data = response.data;
//       setCaptain(data.captain);
//       localStorage.setItem("token", data.token);
//       navigate("/captain-home");
//     }
//     setEmail("");
//     setPassword("");
//   };
//   return (
//     <div className="p-7 flex flex-col justify-between h-screen">
//       <div className="mb-5">
//         {/* Logo Section */}
//         <div className="flex items-center space-x-2">
//           <h1 className="text-xl md:text-2xl font-bold text-black relative">
//             SmartRide
//             <sup className="ml-1 text-xs md:text-sm bg-yellow-400 text-black font-medium px-1 rounded align-top">
//               Captain
//             </sup>
//           </h1>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <h3 className="text-xl font-medium mb-2">What&apos;s your email</h3>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="bg-[#eee] rounded px-4 py-2 border w-full text-lg placeholder:text-base mb-7"
//             required
//             type="email"
//             placeholder="email@example.com"
//           />
//           <h3 className="text-xl font-medium mb-2">Enter Password</h3>
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="bg-[#eee] rounded px-4 py-2 border w-full text-lg placeholder:text-base mb-7"
//             required
//             type="password"
//             placeholder="password"
//           />
//           <button
//             type="submit"
//             className="bg-black text-white text-center py-2 rounded-md text-lg w-full font-medium"
//           >
//             Login
//           </button>
//         </form>
//         <Link to="/captain-signup" className="mb-2 text-start block mt-5 ">
//           Join a fleet?{" "}
//           <span className="text-[#92B4EC] ml-1 font-medium">
//             {" "}
//             Register as a Captain
//           </span>
//         </Link>
//       </div>
//       <div>
//         <Link
//           to={"/login"}
//           className="bg-[#92B4EC] text-black mb-3 flex items-center justify-center text-center py-2 rounded-md text-lg w-full font-medium"
//         >
//           Sign in as User
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default CaptainLogin;
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const captain = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captain
      );

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
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
          setError("Captain account not found. Please register first.");
        } else if (status === 403) {
          setError("Your account has been suspended. Contact support.");
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

      console.error("Captain login error:", err);
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
            Sign in to start accepting rides
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
              Captain Email
            </label>
            <div className="relative">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error on input change
                }}
                className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  error ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                required
                type="email"
                placeholder="captain@example.com"
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
                className={`bg-gray-100 rounded-lg px-4 py-3 pl-11 border-2 w-full text-base placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
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
            className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center py-3 rounded-lg text-lg w-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
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
                <i className="ri-steering-2-fill text-xl"></i>
                <span>Login as Captain</span>
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-base">
            Want to join our fleet?{" "}
            <Link
              to="/captain-signup"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Register as Captain
            </Link>
          </p>
        </div>
      </div>

      {/* User Login Button */}
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
          to="/login"
          className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 flex items-center justify-center text-center py-3 rounded-lg text-lg w-full font-semibold transition-all shadow-md hover:shadow-lg gap-2 border-2 border-gray-300"
        >
          <i className="ri-user-line text-xl"></i>
          <span>Sign in as User</span>
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
