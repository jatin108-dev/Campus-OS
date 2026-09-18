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

    // Remove old demo canteens and the new seeded names.
    // This prevents duplicate demo data when the seed is run again.
    await Canteen.deleteMany({
      name: {
        $in: [
          // Previous names
          "Central Canteen",
          "Food Court",
          "Campus Cafe",
          "Block C Canteen",

          // Current names
          "Bite Box",
          "CafeMonk",
          "ChaiGaram",
          "DosTea",
        ],
      },
    });

    const canteens = await Canteen.insertMany([
      {
        name: "Bite Box",
        description:
          "Quick meals, snacks and refreshing drinks for students.",
        location: "Near Parking",
        owner: owner._id,
        isOpen: true,
        preparationTime: 15,
      },
      {
        name: "CafeMonk",
        description:
          "Coffee, sandwiches, snacks and quick bites between classes.",
        location: "Near Boys Hostel",
        owner: owner._id,
        isOpen: true,
        preparationTime: 10,
      },
      {
        name: "ChaiGaram",
        description:
          "Fresh chai, hot snacks and affordable campus favourites.",
        location: "Near Temple",
        owner: owner._id,
        isOpen: true,
        preparationTime: 8,
      },
      {
        name: "DosTea",
        description:
          "Dosas, tea and quick South Indian bites near the main ground.",
        location: "Near Main Ground",
        owner: owner._id,
        isOpen: true,
        preparationTime: 12,
      },
    ]);

    console.log(`Created ${canteens.length} canteens`);

    canteens.forEach((canteen) => {
      console.log(
        `✓ ${canteen.name} — ${canteen.location}`
      );
    });

    await mongoose.connection.close();

    console.log("Canteen seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Canteen seed failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCanteens();