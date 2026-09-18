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
          "Central Canteen",
          "Food Court",
          "Campus Cafe",
          "Block C Canteen",
        ],
      },
    });

    if (canteens.length === 0) {
      console.error(
        "No demo canteens found. Run seedCanteens.js first."
      );

      await mongoose.connection.close();
      process.exit(1);
    }

    const canteenMap = {};

    canteens.forEach((canteen) => {
      canteenMap[canteen.name] = canteen._id;
    });

    await MenuItem.deleteMany({
      canteen: {
        $in: canteens.map((canteen) => canteen._id),
      },
    });

    const menuItems = [
      // Central Canteen
      {
        canteen: canteenMap["Central Canteen"],
        name: "Veg Masala Dosa",
        description: "Crispy dosa served with sambar and chutney.",
        price: 70,
        category: "Breakfast",
        isAvailable: true,
        preparationTime: 12,
      },
      {
        canteen: canteenMap["Central Canteen"],
        name: "Paneer Roll",
        description: "Soft roll filled with spiced paneer and vegetables.",
        price: 90,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Central Canteen"],
        name: "Veg Thali",
        description: "Complete homestyle meal with roti, rice and dal.",
        price: 120,
        category: "Meals",
        isAvailable: true,
        preparationTime: 15,
      },
      {
        canteen: canteenMap["Central Canteen"],
        name: "Masala Chai",
        description: "Freshly brewed Indian masala tea.",
        price: 25,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 5,
      },

      // Food Court
      {
        canteen: canteenMap["Food Court"],
        name: "Veg Burger",
        description: "Crispy veg patty with fresh vegetables and sauce.",
        price: 80,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Food Court"],
        name: "Cheese Sandwich",
        description: "Toasted sandwich with cheese and vegetables.",
        price: 65,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["Food Court"],
        name: "Veg Noodles",
        description: "Wok-tossed noodles with fresh vegetables.",
        price: 90,
        category: "Meals",
        isAvailable: true,
        preparationTime: 12,
      },
      {
        canteen: canteenMap["Food Court"],
        name: "Cold Coffee",
        description: "Chilled creamy coffee served cold.",
        price: 70,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 5,
      },

      // Campus Cafe
      {
        canteen: canteenMap["Campus Cafe"],
        name: "Cappuccino",
        description: "Rich espresso topped with steamed milk foam.",
        price: 90,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["Campus Cafe"],
        name: "Veg Grilled Sandwich",
        description: "Grilled sandwich packed with vegetables and cheese.",
        price: 85,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["Campus Cafe"],
        name: "French Fries",
        description: "Crispy golden fries with seasoning.",
        price: 60,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 7,
      },
      {
        canteen: canteenMap["Campus Cafe"],
        name: "Chocolate Muffin",
        description: "Soft chocolate muffin for a quick sweet bite.",
        price: 55,
        category: "Desserts",
        isAvailable: true,
        preparationTime: 3,
      },

      // Block C Canteen
      {
        canteen: canteenMap["Block C Canteen"],
        name: "Aloo Paratha",
        description: "Stuffed potato paratha served with curd.",
        price: 60,
        category: "Breakfast",
        isAvailable: true,
        preparationTime: 12,
      },
      {
        canteen: canteenMap["Block C Canteen"],
        name: "Chole Rice",
        description: "Spiced chickpeas served with steamed rice.",
        price: 85,
        category: "Meals",
        isAvailable: true,
        preparationTime: 15,
      },
      {
        canteen: canteenMap["Block C Canteen"],
        name: "Samosa",
        description: "Crispy pastry filled with spiced potatoes.",
        price: 20,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["Block C Canteen"],
        name: "Lemon Water",
        description: "Refreshing chilled lemon drink.",
        price: 25,
        category: "Drinks",
        isAvailable: true,
        preparationTime: 3,
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