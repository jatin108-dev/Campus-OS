import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CanteenHome from "../pages/canteen/CanteenHome";
import CanteenMenu from "../pages/canteen/CanteenMenu";
import Cart from "../pages/canteen/Cart";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/canteen" element={<CanteenHome />} />
      <Route path="/canteen/:canteenId" element={<CanteenMenu />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default AppRoutes;