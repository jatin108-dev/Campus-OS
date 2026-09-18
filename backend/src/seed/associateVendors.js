const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const connectDB = require("../config/db");
const User = require("../models/User");
const Canteen = require("../models/Canteen");

const vendorCanteens = [
  {
    email: "bitebox@gmail.com",
    vendorId: "0069",
    name: "BiteBox",
    description: "Quick bites, snacks and refreshing drinks.",
    location: "GNIOT Campus",
  },
  {
    email: "cafemonk@gmail.com",
    vendorId: "0079",
    name: "Cafe Monk",
    description: "Campus cafe serving beverages and cafe favourites.",
    location: "GNIOT Campus",
  },
  {
    email: "dostea@gmail.com",
    vendorId: "0089",
    name: "Dostea",
    description: "Tea, snacks and everyday campus favourites.",
    location: "GNIOT Campus",
  },
  {
    email: "chaigaram@gmail.com",
    vendorId: "0099",
    name: "Chai Garam",
    description: "Fresh chai and popular Indian snacks.",
    location: "GNIOT Campus",
  },
];

const setupVendorsAndCanteens = async () => {
  try {
    await connectDB();

    console.log("\n🚀 Setting up vendor-canteen associations...\n");

    for (const data of vendorCanteens) {
      const vendor = await User.findOne({
        email: data.email.toLowerCase(),
      });

      if (!vendor) {
        console.log(`❌ Vendor not found: ${data.email}`);
        continue;
      }

      if (vendor.role !== "vendor") {
        console.log(
          `⚠️ ${data.email} exists but role is "${vendor.role}". Skipping.`
        );
        continue;
      }

      // Keep vendor ID consistent
      if (vendor.vendorId !== data.vendorId) {
        vendor.vendorId = data.vendorId;
        await vendor.save();
      }

      let canteen = await Canteen.findOne({
        name: data.name,
      });

      if (!canteen) {
        canteen = await Canteen.create({
          name: data.name,
          description: data.description,
          location: data.location,
          owner: vendor._id,
          isOpen: true,
          preparationTime: 15,
        });

        console.log(
          `✅ Created ${data.name} → ${vendor.fullName} (${data.vendorId})`
        );
      } else {
        canteen.owner = vendor._id;

        // Only fill/update basic canteen information.
        canteen.description = data.description;
        canteen.location = data.location;

        await canteen.save();

        console.log(
          `🔗 Associated ${data.name} → ${vendor.fullName} (${data.vendorId})`
        );
      }
    }

    console.log("\n=================================");
    console.log("✅ Vendor-canteen setup complete");
    console.log("=================================\n");

    const canteens = await Canteen.find({})
      .populate("owner", "fullName email vendorId role")
      .select("name location owner isOpen");

    console.log("Current canteen ownership:\n");

    canteens.forEach((canteen) => {
      console.log(
        `${canteen.name} → ${canteen.owner?.fullName || "NO OWNER"} → ${
          canteen.owner?.email || "N/A"
        }`
      );
    });

    console.log("");
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

setupVendorsAndCanteens();