// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";

// const UserProtectedWraper = ({ children }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Simulate token validation (replace with your API call)
//       setTimeout(() => {
//         setIsAuthenticated(true); // Update based on API response.
//         setIsLoading(false);
//       }, 500); // Simulating an API delay
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   // Show a loading state while validating the token
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default UserProtectedWraper;
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectedWraper = ({ children }) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext); // Access context to set user data
  const [isLoading, setIsLoading] = useState(true); // State to handle loading indicator

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
    }

    // Validate token via API
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in request header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data); // Update user context with profile data
          setIsLoading(false); // Set loading to false when data is fetched
        }
      })
      .catch((err) => {
        localStorage.removeItem("token"); // Clear invalid token
        console.error(err); // Log error for debugging
        navigate("/login"); // Redirect to login if validation fails
      });
  }, [token]);

  // Display loading screen while validating
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render child components if authenticated
  return <>{children}</>;
};

export default UserProtectedWraper;
