const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const connectDB = require("../config/db");
const User = require("../models/User");
const Canteen = require("../models/Canteen");

const mappings = [
  {
    email: "bitebox@gmail.com",
    canteenName: "Bite Box",
    vendorId: "0069",
  },
  {
    email: "cafemonk@gmail.com",
    canteenName: "CafeMonk",
    vendorId: "0079",
  },
  {
    email: "dostea@gmail.com",
    canteenName: "DosTea",
    vendorId: "0089",
  },
  {
    email: "chaigaram@gmail.com",
    canteenName: "ChaiGaram",
    vendorId: "0099",
  },
];

const fixExistingCanteens = async () => {
  try {
    await connectDB();

    console.log("\n🔧 Fixing existing canteen ownership...\n");

    for (const mapping of mappings) {
      const vendor = await User.findOne({
        email: mapping.email.toLowerCase(),
        role: "vendor",
      });

      if (!vendor) {
        console.log(`❌ Vendor not found: ${mapping.email}`);
        continue;
      }

      const canteen = await Canteen.findOne({
        name: mapping.canteenName,
      });

      if (!canteen) {
        console.log(
          `❌ Canteen not found: ${mapping.canteenName}`
        );
        continue;
      }

      canteen.owner = vendor._id;
      await canteen.save();

      console.log(
        `✅ ${mapping.canteenName} → ${vendor.fullName} (${mapping.vendorId})`
      );
    }

    console.log("\n=================================");
    console.log("✅ Existing canteens fixed");
    console.log("=================================\n");

    const canteens = await Canteen.find({})
      .populate("owner", "fullName email vendorId role")
      .select("name location owner");

    console.log("Current ownership:\n");

    canteens.forEach((canteen) => {
      console.log(
        `${canteen.name} → ${
          canteen.owner?.fullName || "NO OWNER"
        } → ${
          canteen.owner?.email || "N/A"
        }`
      );
    });

    console.log("");
  } catch (error) {
    console.error("\n❌ Fix failed:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

fixExistingCanteens();