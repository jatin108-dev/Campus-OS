const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    canteen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canteen",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,

        message:
          "Order must contain at least one item",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * Human-readable pickup time.
     * Example: "10:45"
     */
    pickupTime: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Exact pickup timestamp.
     * This lets the backend validate the
     * selected time correctly.
     */
    pickupAt: {
      type: Date,
      required: true,
    },

    /*
     * Internal 40-minute pickup window.
     *
     * We don't have to show this on the
     * checkout UI.
     */
    pickupWindowEnd: {
      type: Date,
      required: true,
    },

    /*
     * Optional student note.
     */
    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    /*
     * Counter pickup only.
     */
    pickupMethod: {
      type: String,
      enum: ["COUNTER"],
      default: "COUNTER",
    },

    /*
     * UPI only.
     */
    paymentMethod: {
      type: String,
      enum: ["UPI"],
      default: "UPI",
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "FAILED",
      ],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    tokenNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Order", orderSchema);