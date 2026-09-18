import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import CanteenHome from "../pages/canteen/CanteenHome";
import CanteenMenu from "../pages/canteen/CanteenMenu";
import Cart from "../pages/canteen/Cart";
import Checkout from "../pages/canteen/Checkout";
import OrderSuccess from "../pages/canteen/OrderSuccess";
import MyOrders from "../pages/canteen/MyOrders";
import OrderTracking from "../pages/canteen/OrderTracking";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/canteen" element={<CanteenHome />} />
      <Route
        path="/canteen/:canteenId"
        element={<CanteenMenu />}
      />

      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/my-orders" element={<MyOrders />} />

      <Route
        path="/order-tracking/:orderId"
        element={<OrderTracking />}
      />
    </Routes>
  );
};

export default AppRoutes;