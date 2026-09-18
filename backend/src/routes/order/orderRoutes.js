const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getMerchantOrders,
  updateOrderStatus,
} = require("../../controllers/order/orderController");

const { protect, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

// Student
router.post(
  "/",
  protect,
  authorize("student"),
  createOrder
);

router.get(
  "/my-orders",
  protect,
  authorize("student"),
  getMyOrders
);

// Merchant/Admin
router.get(
  "/merchant",
  protect,
  authorize("vendor", "admin"),
  getMerchantOrders
);

// Student / Merchant / Admin
router.get(
  "/:id",
  protect,
  authorize("student", "vendor", "admin"),
  getOrderById
);

// Merchant/Admin
router.patch(
  "/:id/status",
  protect,
  authorize("vendor", "admin"),
  updateOrderStatus
);

module.exports = router;