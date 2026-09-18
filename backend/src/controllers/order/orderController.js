
const mongoose = require("mongoose");

const Order = require("../../models/Order");
const Canteen = require("../../models/Canteen");
const MenuItem = require("../../models/MenuItem");

/* ------------------------------------------
   CONSTANTS
------------------------------------------ */

const MIN_PICKUP_MINUTES = 15;
const MAX_PICKUP_MINUTES = 45;
const SLOT_INTERVAL = 5;
const PICKUP_WINDOW_MINUTES = 40;

/* ------------------------------------------
   TIME HELPERS
------------------------------------------ */

const roundUpToFiveMinutes = (date) => {
  const result = new Date(date);

  result.setSeconds(0);
  result.setMilliseconds(0);

  const remainder =
    result.getMinutes() % SLOT_INTERVAL;

  if (remainder !== 0) {
    result.setMinutes(
      result.getMinutes() +
        (SLOT_INTERVAL - remainder)
    );
  }

  return result;
};

const getMinimumPickupTime = () => {
  const now = new Date();

  const minimum = new Date(
    now.getTime() +
      MIN_PICKUP_MINUTES * 60 * 1000
  );

  return roundUpToFiveMinutes(minimum);
};

/* ------------------------------------------
   CANTEEN TOKEN PREFIX
------------------------------------------ */

const getCanteenPrefix = (name) => {
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return "CT";
  }

  // Bite Box -> BB
  // CafeMonk -> CM
  // ChaiGaram -> CG
  // DosTea -> DT

  const uppercaseLetters =
    cleanName.match(/[A-Z]/g);

  if (
    uppercaseLetters &&
    uppercaseLetters.length >= 2
  ) {
    return uppercaseLetters
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const words = cleanName
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  return cleanName
    .slice(0, 2)
    .toUpperCase();
};

/* ------------------------------------------
   GENERATE UNIQUE TOKEN
------------------------------------------ */

const generateTokenNumber = async (canteen) => {
  const prefix = getCanteenPrefix(canteen.name);

  /*
   * IMPORTANT:
   *
   * tokenNumber has a UNIQUE index in MongoDB.
   *
   * We cannot simply count today's orders because
   * BB-001 may already exist from an older order.
   *
   * Example:
   *
   * Existing:
   * BB-001
   *
   * Next:
   * BB-002
   */

  const existingOrders = await Order.find({
    canteen: canteen._id,
    tokenNumber: {
      $exists: true,
      $ne: null,
    },
  })
    .select("tokenNumber")
    .lean();

  let highestSequence = 0;

  for (const existingOrder of existingOrders) {
    const token = String(
      existingOrder.tokenNumber || ""
    );

    const parts = token.split("-");

    if (parts.length !== 2) {
      continue;
    }

    const tokenPrefix = parts[0];

    if (tokenPrefix !== prefix) {
      continue;
    }

    const sequence = Number(parts[1]);

    if (
      Number.isInteger(sequence) &&
      sequence > highestSequence
    ) {
      highestSequence = sequence;
    }
  }

  const nextSequence =
    highestSequence + 1;

  return `${prefix}-${String(
    nextSequence
  ).padStart(3, "0")}`;
};

/* ==========================================
   CREATE ORDER
========================================== */

const createOrder = async (req, res) => {
  try {
    const {
      canteen: canteenId,
      items,
      pickupTime,
      pickupAt,
      note,
      paymentMethod,
    } = req.body;

    /* --------------------------------------
       BASIC VALIDATION
    -------------------------------------- */

    if (!canteenId) {
      return res.status(400).json({
        success: false,
        message: "Canteen is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(canteenId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid canteen",
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart cannot be empty",
      });
    }

    if (!pickupTime) {
      return res.status(400).json({
        success: false,
        message: "Pickup time is required",
      });
    }

    if (
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(
        pickupTime
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup time format",
      });
    }

    if (!pickupAt) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup time information is required",
      });
    }

    /* --------------------------------------
       UPI ONLY
    -------------------------------------- */

    if (paymentMethod !== "UPI") {
      return res.status(400).json({
        success: false,
        message: "Only UPI payment is supported",
      });
    }

    /* --------------------------------------
       FIND CANTEEN
    -------------------------------------- */

    const canteen =
      await Canteen.findById(canteenId);

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    if (!canteen.isOpen) {
      return res.status(400).json({
        success: false,
        message:
          "This canteen is currently closed",
      });
    }

    /* --------------------------------------
       PICKUP TIME VALIDATION
    -------------------------------------- */

    const selectedPickup =
      new Date(pickupAt);

    if (
      Number.isNaN(
        selectedPickup.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup timestamp",
      });
    }

    if (
      selectedPickup.getSeconds() !== 0 ||
      selectedPickup.getMilliseconds() !== 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup time must be selected from an available slot",
      });
    }

    if (
      selectedPickup.getMinutes() %
        SLOT_INTERVAL !==
      0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup time must be in 5-minute intervals",
      });
    }

    const minimumPickup =
      getMinimumPickupTime();

    const maximumPickup =
      new Date(
        minimumPickup.getTime() +
          (MAX_PICKUP_MINUTES -
            MIN_PICKUP_MINUTES) *
            60 *
            1000
      );

    if (
      selectedPickup < minimumPickup ||
      selectedPickup > maximumPickup
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup time must be between 15 and 45 minutes from now",
      });
    }

    /* --------------------------------------
       INTERNAL PICKUP WINDOW
    -------------------------------------- */

    const pickupWindowEnd =
      new Date(
        selectedPickup.getTime() +
          PICKUP_WINDOW_MINUTES *
            60 *
            1000
      );

    /* --------------------------------------
       VALIDATE CART ITEMS
    -------------------------------------- */

    const menuItemIds = items.map(
      (item) => item.menuItem
    );

    const invalidId =
      menuItemIds.find(
        (id) =>
          !mongoose.Types.ObjectId.isValid(id)
      );

    if (invalidId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid menu item in cart",
      });
    }

    const menuItems =
      await MenuItem.find({
        _id: {
          $in: menuItemIds,
        },
        canteen: canteenId,
      });

    if (
      menuItems.length !==
      menuItemIds.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "One or more menu items do not belong to this canteen",
      });
    }

    /* --------------------------------------
       CHECK AVAILABILITY
    -------------------------------------- */

    const unavailableItem =
      menuItems.find(
        (item) => !item.isAvailable
      );

    if (unavailableItem) {
      return res.status(400).json({
        success: false,
        message:
          `${unavailableItem.name} is currently unavailable`,
      });
    }

    /* --------------------------------------
       BUILD ORDER ITEMS
    -------------------------------------- */

    const orderItems =
      items.map((cartItem) => {
        const menuItem =
          menuItems.find(
            (item) =>
              item._id.toString() ===
              cartItem.menuItem
          );

        const quantity =
          Number(cartItem.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error(
            `Invalid quantity for ${menuItem.name}`
          );
        }

        return {
          menuItem: menuItem._id,
          name: menuItem.name,

          // Never trust frontend quantity/price
          quantity,

          // Always use DB price
          price: menuItem.price,
        };
      });

    /* --------------------------------------
       TOTAL
    -------------------------------------- */

    const totalAmount =
      orderItems.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      );

    /* --------------------------------------
       NOTE
    -------------------------------------- */

    const cleanNote =
      typeof note === "string"
        ? note.trim().slice(0, 200)
        : "";

    /* --------------------------------------
       CREATE ORDER
    -------------------------------------- */

    let order = null;
    let lastCreateError = null;

    /*
     * Retry a few times in case two users
     * create an order at exactly the same time
     * and MongoDB rejects a duplicate token.
     */

    for (
      let attempt = 0;
      attempt < 3;
      attempt += 1
    ) {
      try {
        const tokenNumber =
          await generateTokenNumber(
            canteen
          );

        order =
          await Order.create({
            student: req.user._id,

            canteen: canteen._id,

            items: orderItems,

            totalAmount,

            pickupTime,

            pickupAt: selectedPickup,

            pickupWindowEnd,

            note: cleanNote,

            pickupMethod: "COUNTER",

            paymentMethod: "UPI",

            /*
             * Demo payment.
             * Replace with actual gateway
             * verification later.
             */
            paymentStatus: "PAID",

            orderStatus: "PLACED",

            tokenNumber,
          });

        // Successfully created
        break;
      } catch (error) {
        lastCreateError = error;

        /*
         * If duplicate token occurs,
         * generate another token.
         */
        if (
          error?.code !== 11000 ||
          !error?.keyPattern?.tokenNumber
        ) {
          throw error;
        }
      }
    }

    if (!order) {
      throw (
        lastCreateError ||
        new Error(
          "Unable to generate a unique order token"
        )
      );
    }

    /* --------------------------------------
       POPULATE ORDER
    -------------------------------------- */

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "canteen",
          "name location isOpen preparationTime"
        )
        .populate(
          "student",
          "fullName email enrollmentNumber"
        );

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create order",
    });
  }
};

/* ==========================================
   GET MY ORDERS
========================================== */

const getMyOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({
        student: req.user._id,
      })
        .populate(
          "canteen",
          "name location isOpen"
        )
        .sort({
          createdAt: -1,
        });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch your orders",
    });
  }
};

/* ==========================================
   GET MERCHANT ORDERS
========================================== */

const getMerchantOrders = async (
  req,
  res
) => {
  try {
    const canteens =
      await Canteen.find({
        owner: req.user._id,
      }).select("_id");

    const canteenIds =
      canteens.map(
        (canteen) => canteen._id
      );

    if (!canteenIds.length) {
      return res.json({
        success: true,
        count: 0,
        orders: [],
      });
    }

    const orders =
      await Order.find({
        canteen: {
          $in: canteenIds,
        },
      })
        .populate(
          "student",
          "fullName email enrollmentNumber"
        )
        .populate(
          "canteen",
          "name location isOpen"
        )
        .sort({
          createdAt: -1,
        });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get merchant orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch merchant orders",
    });
  }
};

/* ==========================================
   GET SINGLE ORDER
========================================== */

const getOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order =
      await Order.findById(id)
        .populate(
          "student",
          "fullName email enrollmentNumber"
        )
        .populate(
          "canteen",
          "name description location owner isOpen preparationTime"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* --------------------------------------
       ACCESS CONTROL
    -------------------------------------- */

    const isStudent =
      order.student?._id?.toString() ===
      req.user._id.toString();

    const isOwner =
      order.canteen?.owner?.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (
      !isStudent &&
      !isOwner &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this order",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order",
    });
  }
};

/* ==========================================
   UPDATE ORDER STATUS
========================================== */

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const allowedStatuses = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });
    }

    const order =
      await Order.findById(id)
        .populate(
          "canteen",
          "name owner"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* --------------------------------------
       MERCHANT AUTHORIZATION
    -------------------------------------- */

    const isOwner =
      order.canteen?.owner?.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (
      !isOwner &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this order",
      });
    }

    /* --------------------------------------
       STATUS FLOW
    -------------------------------------- */

    const allowedTransitions = {
      PLACED: [
        "CONFIRMED",
        "CANCELLED",
      ],

      CONFIRMED: [
        "PREPARING",
        "CANCELLED",
      ],

      PREPARING: [
        "READY",
        "CANCELLED",
      ],

      READY: [
        "COMPLETED",
      ],

      COMPLETED: [],

      CANCELLED: [],
    };

    const currentStatus =
      order.orderStatus;

    if (
      currentStatus !== status &&
      !allowedTransitions[
        currentStatus
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot change order status from ${currentStatus} to ${status}`,
      });
    }

    order.orderStatus = status;

    await order.save();

    const updatedOrder =
      await Order.findById(
        order._id
      )
        .populate(
          "student",
          "fullName email enrollmentNumber"
        )
        .populate(
          "canteen",
          "name location owner"
        );

    return res.json({
      success: true,
      message:
        `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
    });
  }
};

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  createOrder,
  getMyOrders,
  getMerchantOrders,
  getOrderById,
  updateOrderStatus,
};