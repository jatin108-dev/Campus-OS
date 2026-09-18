const Order = require("../../models/Order");
const Canteen = require("../../models/Canteen");
const MenuItem = require("../../models/MenuItem");

const generateTokenNumber = async (canteen) => {
  const prefix = canteen.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const ordersToday = await Order.countDocuments({
    canteen: canteen._id,
    createdAt: { $gte: startOfDay },
  });

  return `${prefix}-${String(ordersToday + 1).padStart(3, "0")}`;
};

const createOrder = async (req, res) => {
  try {
    const {
      canteen,
      items,
      pickupTime,
      building,
      floor,
      room,
    } = req.body;

    if (
      !canteen ||
      !items ||
      !items.length ||
      !pickupTime ||
      !building ||
      !floor ||
      !room
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all order details",
      });
    }

    const canteenData = await Canteen.findById(canteen);

    if (!canteenData) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    if (!canteenData.isOpen) {
      return res.status(400).json({
        success: false,
        message: "This canteen is currently closed",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findOne({
        _id: item.menuItem,
        canteen,
      });

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is currently unavailable`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid item quantity",
        });
      }

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
      });

      totalAmount += menuItem.price * quantity;
    }

    const tokenNumber = await generateTokenNumber(canteenData);

    const order = await Order.create({
      student: req.user._id,
      canteen,
      items: orderItems,
      totalAmount,
      pickupTime,
      building,
      floor,
      room,
      paymentStatus: "PAID",
      orderStatus: "PLACED",
      tokenNumber,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("student", "fullName email enrollmentNumber")
      .populate("canteen", "name location")
      .populate("items.menuItem", "name price category");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      student: req.user._id,
    })
      .populate("canteen", "name location")
      .populate("items.menuItem", "name price category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get student orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("student", "fullName email enrollmentNumber")
      .populate("canteen", "name location")
      .populate("items.menuItem", "name price category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isStudent =
      order.student._id.toString() === req.user._id.toString();

    let isMerchant = false;

    if (order.canteen) {
      const canteen = await Canteen.findById(order.canteen._id);

      isMerchant =
        canteen &&
        canteen.owner.toString() === req.user._id.toString();
    }

    const isAdmin = req.user.role === "admin";

    if (!isStudent && !isMerchant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

const getMerchantOrders = async (req, res) => {
  try {
    let canteenIds = [];

    if (req.user.role === "admin") {
      const canteens = await Canteen.find().select("_id");
      canteenIds = canteens.map((canteen) => canteen._id);
    } else {
      const canteen = await Canteen.findOne({
        owner: req.user._id,
      });

      if (!canteen) {
        return res.status(404).json({
          success: false,
          message: "No canteen found for this vendor",
        });
      }

      canteenIds = [canteen._id];
    }

    const orders = await Order.find({
      canteen: { $in: canteenIds },
    })
      .populate("student", "fullName email enrollmentNumber")
      .populate("canteen", "name location")
      .populate("items.menuItem", "name price category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get merchant orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch merchant orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "CONFIRMED",
      "PREPARING",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const canteen = await Canteen.findById(order.canteen);

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    if (
      canteen.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this order",
      });
    }

    order.orderStatus = status;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("student", "fullName email enrollmentNumber")
      .populate("canteen", "name location")
      .populate("items.menuItem", "name price category");

    res.status(200).json({
      success: true,
      message: `Order marked as ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getMerchantOrders,
  updateOrderStatus,
};