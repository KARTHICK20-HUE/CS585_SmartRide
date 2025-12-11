/* eslint-disable react/prop-types */
const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.waitingForDriver(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-1 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Driver Info Card */}
        <div className="flex justify-between">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-4 mb-6 shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border-3 border-gray-300 shadow-lg"
                    src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    alt="driver profile"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div className="min-w-0">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 capitalize truncate">
                    {props.ride?.captain.fullname.firstname}
                  </h2>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-700">
                    {props.ride?.captain.vehicle.plate}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600">
                    {props.ride?.captain.vehicle.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                    <i className="ri-star-fill text-yellow-400"></i>
                    {props.ride?.captain.rating?.toFixed(1) || "0.0"}
                    <span className="text-gray-400">
                      ({props.ride?.captain.ratingCount || 0})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* OTP Section - Make it PROMINENT */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl p-4 md:p-5 mb-6 shadow-lg">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2 flex items-center justify-center gap-2">
                <i className="ri-lock-password-fill text-orange-600"></i>
                Your Ride OTP
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-gray-900 font-mono">
                {props.ride?.otp}
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Share this code with your driver
              </p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Pickup */}
          <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border-b-2 border-gray-100">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-green-100 rounded-full flex-shrink-0">
              <i className="ri-map-pin-user-fill text-green-600 text-lg md:text-xl"></i>
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
          <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border-b-2 border-gray-100">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-red-100 rounded-full flex-shrink-0">
              <i className="ri-map-pin-2-fill text-red-600 text-lg md:text-xl"></i>
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
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-yellow-100 rounded-full flex-shrink-0">
              <i className="ri-currency-line text-yellow-600 text-lg md:text-xl"></i>
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

        {/* Safety Info */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-2 md:gap-3">
            <i className="ri-shield-check-fill text-blue-600 text-lg md:text-xl mt-0.5 flex-shrink-0"></i>
            <div>
              <p className="text-xs md:text-sm font-medium text-blue-900 mb-1">
                Safety Tips
              </p>
              <p className="text-xs text-blue-700">
                Verify the vehicle number matches before entering. Share your
                trip details with friends or family.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
