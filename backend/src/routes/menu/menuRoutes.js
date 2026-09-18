const express = require("express");

const {
  getMenuByCanteen,
  getMerchantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../../controllers/menu/menuController");

const { protect, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

// Public menu
router.get("/:canteenId", getMenuByCanteen);

// Vendor/Admin menu
// IMPORTANT: keep this BEFORE /:canteenId
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

module.exports = router;