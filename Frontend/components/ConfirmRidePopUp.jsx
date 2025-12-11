// /* eslint-disable react/prop-types */
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ConfirmRidePopUp = (props) => {
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();

//   const submitHander = async (e) => {
//     e.preventDefault();

//     const response = await axios.get(
//       `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
//       {
//         params: {
//           rideId: props.ride._id,
//           otp: otp,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     if (response.status === 200) {
//       props.setConfirmRidePopupPanel(false);
//       props.setRidePopupPanel(false);
//       navigate("/captain-riding", { state: { ride: props.ride } });
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Close Button */}
//       <button
//         className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"
//         onClick={() => {
//           props.setConfirmRidePopupPanel(false);
//         }}
//       ></button>

//       {/* Header Section */}
//       <div className="text-center mb-6">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full mb-3 shadow-lg">
//           <i className="text-3xl text-white ri-steering-2-fill"></i>
//         </div>
//         <h3 className="text-2xl font-bold text-gray-900 mb-1">
//           Confirm Ride to Start
//         </h3>
//         <p className="text-sm text-gray-500">Enter OTP provided by passenger</p>
//       </div>

//       {/* User Info Card */}
//       <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6 shadow-md">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <img
//                 className="h-14 w-14 rounded-full object-cover border-3 border-white shadow-lg"
//                 src="https://marketplace.canva.com/Dz63E/MAF4KJDz63E/1/tl/canva-user-icon-MAF4KJDz63E.png"
//                 alt="user profile image"
//               />
//               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 capitalize">
//                 {props.ride?.user.fullname.firstname}
//               </h2>
//               <p className="text-xs text-gray-600 flex items-center gap-1">
//                 <i className="ri-user-star-fill text-yellow-600"></i>
//                 Passenger
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-xs text-gray-500 font-medium">Distance</p>
//             <h5 className="text-xl font-bold text-orange-600">2.2 KM</h5>
//           </div>
//         </div>
//       </div>

//       {/* Trip Details */}
//       <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
//         {/* Pickup Location */}
//         <div className="flex items-start gap-4 p-4 bg-green-50 border-b border-gray-200">
//           <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full flex-shrink-0 shadow-md">
//             <i className="ri-map-pin-user-fill text-white text-xl"></i>
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="text-base font-semibold text-gray-900 mb-1">
//               Pickup Location
//             </h3>
//             <p className="text-sm text-gray-600 line-clamp-2">
//               {props.ride?.pickup}
//             </p>
//           </div>
//         </div>

//         {/* Destination */}
//         <div className="flex items-start gap-4 p-4 bg-red-50 border-b border-gray-200">
//           <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full flex-shrink-0 shadow-md">
//             <i className="ri-map-pin-2-fill text-white text-xl"></i>
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="text-base font-semibold text-gray-900 mb-1">
//               Destination
//             </h3>
//             <p className="text-sm text-gray-600 line-clamp-2">
//               {props.ride?.destination}
//             </p>
//           </div>
//         </div>

//         {/* Fare */}
//         <div className="flex items-center gap-4 p-4 bg-yellow-50">
//           <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-full flex-shrink-0 shadow-md">
//             <i className="ri-currency-line text-white text-xl"></i>
//           </div>
//           <div className="flex-1">
//             <h3 className="text-base font-semibold text-gray-900 mb-1">
//               ${props.ride?.fare}
//             </h3>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <i className="ri-money-rupee-circle-fill text-green-600"></i>
//               Cash Payment
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* OTP Input Form */}
//       <form onSubmit={submitHander} className="space-y-4">
//         {/* OTP Input */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//             <i className="ri-lock-password-fill text-orange-600"></i>
//             Enter OTP
//           </label>
//           <input
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             type="text"
//             maxLength="6"
//             className="bg-gray-100 border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 px-6 py-4 font-mono text-2xl tracking-widest text-center rounded-xl w-full transition-all outline-none"
//             placeholder="000000"
//             required
//           />
//           <p className="text-xs text-gray-500 mt-2 text-center">
//             Ask passenger for the 6-digit OTP
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-2">
//           <button
//             type="button"
//             onClick={() => {
//               props.setConfirmRidePopupPanel(false);
//               props.setRidePopupPanel(false);
//             }}
//             className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
//           >
//             <i className="ri-close-circle-line text-xl"></i>
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
//           >
//             <i className="ri-check-double-line text-xl"></i>
//             Start Ride
//           </button>
//         </div>
//       </form>

//       {/* Additional Info */}
//       <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//         <div className="flex items-start gap-3">
//           <i className="ri-information-fill text-blue-600 text-xl mt-0.5"></i>
//           <div>
//             <p className="text-sm font-medium text-blue-900 mb-1">
//               Safety First
//             </p>
//             <p className="text-xs text-blue-700">
//               Verify the OTP before starting the ride. Contact support if you
//               face any issues.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmRidePopUp;
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHander = async (e) => {
    e.preventDefault();

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
      {
        params: {
          rideId: props.ride._id,
          otp: otp,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Close Button - Drag Handle for Mobile, X for Desktop */}
      <div className="flex justify-center md:justify-end mb-4 flex-shrink-0">
        <button
          className="w-12 h-1 md:w-8 md:h-8 bg-gray-300 md:bg-transparent rounded-full md:rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
          onClick={() => {
            props.setConfirmRidePopupPanel(false);
          }}
        >
          <i className="hidden md:block text-2xl text-gray-500 ri-close-line"></i>
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-1 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full mb-3 shadow-lg">
            <i className="text-2xl md:text-3xl text-white ri-steering-2-fill"></i>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Confirm Ride to Start
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Enter OTP provided by passenger
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border-3 border-white shadow-lg"
                  src="https://marketplace.canva.com/Dz63E/MAF4KJDz63E/1/tl/canva-user-icon-MAF4KJDz63E.png"
                  alt="user profile"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-bold text-gray-900 capitalize truncate">
                  {props.ride?.user.fullname.firstname}
                </h2>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <i className="ri-user-star-fill text-yellow-600"></i>
                  Passenger
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500 font-medium">Distance</p>
              <h5 className="text-lg md:text-xl font-bold text-orange-600">
                {props.ride?.distance?.text || "..."}
              </h5>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4 md:mb-6 shadow-sm">
          {/* Pickup Location */}
          <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-green-50 border-b border-gray-200">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-green-500 rounded-full flex-shrink-0 shadow-md">
              <i className="ri-map-pin-user-fill text-white text-lg md:text-xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                Pickup Location
              </h3>
              <p className="text-xs md:text-sm text-gray-600 break-words">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-red-50 border-b border-gray-200">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-red-500 rounded-full flex-shrink-0 shadow-md">
              <i className="ri-map-pin-2-fill text-white text-lg md:text-xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                Destination
              </h3>
              <p className="text-xs md:text-sm text-gray-600 break-words">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-yellow-50">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-yellow-500 rounded-full flex-shrink-0 shadow-md">
              <i className="ri-currency-line text-white text-lg md:text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                ${props.ride?.fare}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                <i className="ri-money-rupee-circle-fill text-green-600"></i>
                Cash Payment
              </p>
            </div>
          </div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={submitHander} className="space-y-3 md:space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <i className="ri-lock-password-fill text-orange-600"></i>
              Enter OTP
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              maxLength="6"
              inputMode="numeric"
              pattern="[0-9]*"
              className="bg-gray-100 border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 px-4 py-3 md:px-6 md:py-4 font-mono text-xl md:text-2xl tracking-widest text-center rounded-xl w-full transition-all outline-none"
              placeholder="000000"
              required
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Ask passenger for the 6-digit OTP
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 font-semibold py-3 md:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm md:text-base"
            >
              <i className="ri-close-circle-line text-lg md:text-xl"></i>
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
            >
              <i className="ri-check-double-line text-lg md:text-xl"></i>
              Start Ride
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-2 md:gap-3">
            <i className="ri-information-fill text-blue-600 text-lg md:text-xl mt-0.5 flex-shrink-0"></i>
            <div>
              <p className="text-xs md:text-sm font-medium text-blue-900 mb-1">
                Safety First
              </p>
              <p className="text-xs text-blue-700">
                Verify the OTP before starting the ride. Contact support if you
                face any issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
