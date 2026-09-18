const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const canteenRoutes = require("./routes/canteen/canteenRoutes");
const menuRoutes = require("./routes/menu/menuRoutes");
const orderRoutes = require("./routes/order/orderRoutes");

const app = express();

// CORS

const allowedOrigins = [
  "http://localhost:5173",
  "https://campus-os-gamma-rust.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// BODY & COOKIE MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// TEST ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusOS Backend Running Successfully",
  });
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// CANTEEN ROUTES
app.use("/api/canteens", canteenRoutes);


// MENU ROUTES
app.use("/api/menu", menuRoutes);

// ================================
// ORDER ROUTES
// ================================

app.use("/api/orders", orderRoutes);


// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;