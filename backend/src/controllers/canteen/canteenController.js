const Canteen = require("../../models/Canteen");

const getCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find()
      .populate("owner", "fullName email vendorId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      canteens,
    });
  } catch (error) {
    console.error("Get canteens error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch canteens",
    });
  }
};

const getCanteenById = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id).populate(
      "owner",
      "fullName email vendorId"
    );

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    res.status(200).json({
      success: true,
      canteen,
    });
  } catch (error) {
    console.error("Get canteen error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch canteen",
    });
  }
};

const createCanteen = async (req, res) => {
  try {
    const { name, description, location, preparationTime } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Canteen name and location are required",
      });
    }

    const existingCanteen = await Canteen.findOne({
      owner: req.user._id,
    });

    if (existingCanteen) {
      return res.status(400).json({
        success: false,
        message: "You already own a canteen",
      });
    }

    const canteen = await Canteen.create({
      name,
      description,
      location,
      preparationTime,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Canteen created successfully",
      canteen,
    });
  } catch (error) {
    console.error("Create canteen error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create canteen",
    });
  }
};

const updateCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);

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
        message: "You are not allowed to modify this canteen",
      });
    }

    const { name, description, location, preparationTime, isOpen } = req.body;

    if (name !== undefined) canteen.name = name;
    if (description !== undefined) canteen.description = description;
    if (location !== undefined) canteen.location = location;
    if (preparationTime !== undefined)
      canteen.preparationTime = preparationTime;
    if (isOpen !== undefined) canteen.isOpen = isOpen;

    await canteen.save();

    res.status(200).json({
      success: true,
      message: "Canteen updated successfully",
      canteen,
    });
  } catch (error) {
    console.error("Update canteen error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update canteen",
    });
  }
};

const getMyCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findOne({
      owner: req.user._id,
    });

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: "No canteen found for this vendor",
      });
    }

    res.status(200).json({
      success: true,
      canteen,
    });
  } catch (error) {
    console.error("Get my canteen error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your canteen",
    });
  }
};

module.exports = {
  getCanteens,
  getCanteenById,
  createCanteen,
  updateCanteen,
  getMyCanteen,
};