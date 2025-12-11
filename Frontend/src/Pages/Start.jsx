// import { Link } from "react-router-dom";

// const Start = () => {
//   return (
//     <div>
//       <div className="bg-cover bg-center bg-gray-100 h-screen flex flex-col justify-end items-center bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
//         <div className="absolute left-5 top-5">
//           <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">
//             SmartRide
//           </h1>
//         </div>

//         <div className="bg-white h-32 flex flex-col w-full px-5 py-2 gap-3">
//           <h2 className="text-2xl font-semibold">Get Started with SmartRide</h2>
//           <Link
//             to={"/login"}
//             className="bg-black text-white text-center py-2 rounded-md text-lg"
//           >
//             Continue
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Start;
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-end items-center">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=1887&auto=format&fit=crop')",
        }}
      >
        {/* Gradient overlay to make logo and text pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
      </div>

      {/* Logo Section */}
      <div className="absolute left-5 top-5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
          SmartRide
        </h1>
      </div>

      {/* Bottom card section */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm w-full px-5 py-5 sm:px-8 sm:py-8 rounded-t-2xl shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 text-center sm:text-left">
          Get Started with SmartRide
        </h2>
        <Link
          to="/login"
          className="block bg-black hover:bg-gray-900 text-white text-center py-3 rounded-md text-lg sm:text-xl font-medium transition"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
