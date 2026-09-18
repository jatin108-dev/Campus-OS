const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Canteen = require("../models/Canteen");
const MenuItem = require("../models/MenuItem");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const canteens = await Canteen.find({
      name: {
        $in: [
          "Bite Box",
          "CafeMonk",
          "ChaiGaram",
          "DosTea",
        ],
      },
    });

    if (canteens.length !== 4) {
      console.error(
        "Expected 4 canteens. Run seedCanteens.js first."
      );

      await mongoose.connection.close();
      process.exit(1);
    }

    const canteenMap = {};

    canteens.forEach((canteen) => {
      canteenMap[canteen.name] = canteen._id;
    });

    // Remove existing menu items belonging to these demo canteens.
    await MenuItem.deleteMany({
      canteen: {
        $in: canteens.map((canteen) => canteen._id),
      },
    });

    const menuItems = [
      // ==========================================
      // BITE BOX
      // ==========================================

      {
        canteen: canteenMap["Bite Box"],
        name: "Veg Burger",
        description:
          "Crispy veg patty with fresh vegetables and sauce.",
        price: 80,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Paneer Roll",
        description:
          "Soft roll filled with spiced paneer and vegetables.",
        price: 90,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Cheese Sandwich",
        description:
          "Toasted sandwich with cheese and fresh vegetables.",
        price: 65,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Cold Coffee",
        description:
          "Chilled creamy coffee for a refreshing break.",
        price: 70,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 5,
      },

      // ==========================================
      // CAFEMONK
      // ==========================================

      {
        canteen: canteenMap["CafeMonk"],
        name: "Cappuccino",
        description:
          "Rich espresso topped with steamed milk foam.",
        price: 90,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Cafe Latte",
        description:
          "Smooth espresso with creamy steamed milk.",
        price: 95,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Veg Grilled Sandwich",
        description:
          "Grilled sandwich packed with vegetables and cheese.",
        price: 85,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Chocolate Muffin",
        description:
          "Soft chocolate muffin for a quick sweet bite.",
        price: 55,
        category: "Desserts",
        isAvailable: true,
        preparationTime: 3,
      },

      // ==========================================
      // CHAIGARAM
      // ==========================================

      {
        canteen: canteenMap["ChaiGaram"],
        name: "Masala Chai",
        description:
          "Freshly brewed Indian masala tea.",
        price: 25,
        category: "Chai",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Ginger Chai",
        description:
          "Hot tea infused with fresh ginger.",
        price: 30,
        category: "Chai",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Samosa",
        description:
          "Crispy pastry filled with spiced potatoes.",
        price: 20,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Aloo Samosa Chaat",
        description:
          "Samosa topped with chutneys and Indian spices.",
        price: 50,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 7,
      },

      // ==========================================
      // DOSTEA
      // ==========================================

      {
        canteen: canteenMap["DosTea"],
        name: "Masala Dosa",
        description:
          "Crispy dosa with spiced potato filling, sambar and chutney.",
        price: 70,
        category: "Dosa",
        isAvailable: true,
        preparationTime: 12,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Paneer Dosa",
        description:
          "Crispy dosa filled with spiced paneer and vegetables.",
        price: 95,
        category: "Dosa",
        isAvailable: true,
        preparationTime: 14,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Idli Sambar",
        description:
          "Soft steamed idlis served with hot sambar.",
        price: 55,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Filter Coffee",
        description:
          "Traditional South Indian filter coffee.",
        price: 40,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 5,
      },
    ];

    const created = await MenuItem.insertMany(menuItems);

    console.log(`Created ${created.length} menu items`);

    await mongoose.connection.close();

    console.log("Menu seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Menu seed failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedMenu();