import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     localStorage.removeItem("token");
  //     navigate("/captain-login");
  //   }
  // }, [token]);
  useEffect(() => {
    async function doLogout() {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Logout error:", err);
      }

      localStorage.removeItem("token");
      navigate("/captain-login");
    }

    if (token) {
      doLogout();
    } else {
      navigate("/captain-login");
    }
  }, []);

  return <div>CaptainLogout</div>;
};

export default CaptainLogout;
