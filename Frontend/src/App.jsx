import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Start from "./pages/Start";
import UserProtectedWraper from "./pages/UserProtectedWraper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectedWraper from "./pages/CaptainProtectedWraper";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import RideHistory from "./pages/RideHistory";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/ride-history" element={<RideHistory />} />
        <Route
          path="/home"
          element={
            <UserProtectedWraper>
              <Home />
            </UserProtectedWraper>
          }
        />
        <Route
          path="/logout"
          element={
            <UserProtectedWraper>
              <UserLogout />
            </UserProtectedWraper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectedWraper>
              <CaptainHome />
            </CaptainProtectedWraper>
          }
        />
        <Route
          path="/captain-logout"
          element={
            <CaptainProtectedWraper>
              <CaptainLogout />
            </CaptainProtectedWraper>
          }
        />
      </Routes>
    </>
  );
};

export default App;
