const MenuItem = require("../../models/MenuItem");
const Canteen = require("../../models/Canteen");

const getMenuByCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;

    const canteen = await Canteen.findById(canteenId);

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    const menuItems = await MenuItem.find({
      canteen: canteenId,
    }).sort({ category: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.error("Get menu error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const {
      canteen,
      name,
      description,
      price,
      category,
      image,
      preparationTime,
      isAvailable,
    } = req.body;

    if (!canteen || !name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Canteen, name, price and category are required",
      });
    }

    const canteenData = await Canteen.findById(canteen);

    if (!canteenData) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    if (
      canteenData.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot manage this canteen's menu",
      });
    }

    const menuItem = await MenuItem.create({
      canteen,
      name,
      description,
      price,
      category,
      image,
      preparationTime,
      isAvailable,
    });

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Create menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create menu item",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const canteen = await Canteen.findById(menuItem.canteen);

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
        message: "You cannot modify this menu item",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "image",
      "preparationTime",
      "isAvailable",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        menuItem[field] = req.body[field];
      }
    });

    await menuItem.save();

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const canteen = await Canteen.findById(menuItem.canteen);

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
        message: "You cannot delete this menu item",
      });
    }

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
    });
  }
};

const getMerchantMenu = async (req, res) => {
  try {
    let canteens;

    if (req.user.role === "admin") {
      canteens = await Canteen.find({}).select(
        "_id name location owner isOpen"
      );
    } else {
      canteens = await Canteen.find({
        owner: req.user._id,
      }).select("_id name location owner isOpen");
    }

    if (!canteens.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        canteens: [],
        menuItems: [],
      });
    }

    const canteenIds = canteens.map((canteen) => canteen._id);

    const menuItems = await MenuItem.find({
      canteen: { $in: canteenIds },
    }).sort({
      category: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      canteens,
      menuItems,
    });
  } catch (error) {
    console.error("Get merchant menu error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch merchant menu",
    });
  }
};

module.exports = {
  getMenuByCanteen,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMerchantMenu
};