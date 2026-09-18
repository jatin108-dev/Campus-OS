const express = require("express");

const {
  getMenuByCanteen,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../../controllers/menu/menuController");

const { protect, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/:canteenId", getMenuByCanteen);

// Vendor/Admin
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