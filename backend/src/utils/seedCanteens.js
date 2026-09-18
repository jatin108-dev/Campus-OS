const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Canteen = require("../models/Canteen");
const User = require("../models/User");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const seedCanteens = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Find an existing vendor
    const owner = await User.findOne({ role: "vendor" });

    if (!owner) {
      console.error(
        "No vendor found. Please create a vendor account first."
      );

      await mongoose.connection.close();
      process.exit(1);
    }

    // Remove previously seeded demo canteens
    await Canteen.deleteMany({
      name: {
        $in: [
          "Central Canteen",
          "Food Court",
          "Campus Cafe",
          "Block C Canteen",
        ],
      },
    });

    const canteens = await Canteen.insertMany([
      {
        name: "Central Canteen",
        description:
          "Everyday meals, snacks and refreshing drinks for students.",
        location: "Main Block • Ground Floor",
        owner: owner._id,
        isOpen: true,
        preparationTime: 15,
      },
      {
        name: "Food Court",
        description:
          "Quick meals, combos and popular campus favourites.",
        location: "Block B • Ground Floor",
        owner: owner._id,
        isOpen: true,
        preparationTime: 12,
      },
      {
        name: "Campus Cafe",
        description:
          "Coffee, sandwiches, snacks and quick bites between classes.",
        location: "Academic Block • First Floor",
        owner: owner._id,
        isOpen: true,
        preparationTime: 10,
      },
      {
        name: "Block C Canteen",
        description:
          "Affordable meals and snacks for students around Block C.",
        location: "Block C • Ground Floor",
        owner: owner._id,
        isOpen: false,
        preparationTime: 20,
      },
    ]);

    console.log(`Created ${canteens.length} canteens`);

    canteens.forEach((canteen) => {
      console.log(`✓ ${canteen.name}`);
    });

    await mongoose.connection.close();

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCanteens();