const express = require("express");

const {
  getCanteens,
  getCanteenById,
  createCanteen,
  updateCanteen,
  getMyCanteen,
} = require("../../controllers/canteen/canteenController");

const { protect, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getCanteens);
router.get("/:id", getCanteenById);

// Vendor
router.get(
  "/vendor/my-canteen",
  protect,
  authorize("vendor", "admin"),
  getMyCanteen
);

router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  createCanteen
);

router.put(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  updateCanteen
);

module.exports = router;