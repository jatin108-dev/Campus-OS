const express = require("express");

const {
  getMenuByCanteen,
  getMerchantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../../controllers/menu/menuController");

const {
  protect,
  authorize,
} = require("../../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// VENDOR / ADMIN MENU
// IMPORTANT: Specific routes MUST come before /:canteenId
// =====================================================

router.get(
  "/merchant",
  protect,
  authorize("vendor", "admin"),
  getMerchantMenu
);

router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  createMenuItem
);

router.put(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  updateMenuItem
);

router.delete(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  deleteMenuItem
);

// =====================================================
// PUBLIC STUDENT MENU
// Keep dynamic route LAST
// =====================================================

router.get(
  "/:canteenId",
  getMenuByCanteen
);

module.exports = router;