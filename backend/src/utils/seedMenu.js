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

    /*
      Remove existing menu items for our four demo canteens.
      Running this seed again will therefore refresh the menu
      instead of creating duplicates.
    */
    await MenuItem.deleteMany({
      canteen: {
        $in: canteens.map((canteen) => canteen._id),
      },
    });

    const menuItems = [

      // =====================================================
      // =====================================================
      // BITE BOX
      // 7 COMMON + 7 UNIQUE
      // =====================================================
      // =====================================================

      // ---------- COMMON COMPETITION ITEMS ----------

      {
        canteen: canteenMap["Bite Box"],
        name: "Masala Chai",
        description:
          "Freshly brewed Indian tea with aromatic spices.",
        price: 25,
        category: "Chai & Beverages",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Cold Coffee",
        description:
          "Chilled creamy coffee blended for a refreshing break.",
        price: 70,
        category: "Chai & Beverages",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Veg Burger",
        description:
          "Crispy vegetable patty with lettuce, tomato and signature sauce.",
        price: 80,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Paneer Roll",
        description:
          "Soft wrap filled with spicy paneer, onions and fresh vegetables.",
        price: 90,
        category: "Rolls & Wraps",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Veg Grilled Sandwich",
        description:
          "Golden grilled sandwich loaded with vegetables and cheese.",
        price: 85,
        category: "Sandwiches",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Samosa",
        description:
          "Crispy golden pastry filled with spiced potatoes.",
        price: 20,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Masala Dosa",
        description:
          "Crispy dosa filled with spiced potato and served with chutney.",
        price: 70,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 12,
      },

      // ---------- BITE BOX SPECIALS ----------

      {
        canteen: canteenMap["Bite Box"],
        name: "Loaded Cheese Fries",
        description:
          "Crispy fries topped with creamy cheese sauce and herbs.",
        price: 95,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 9,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Mexican Paneer Wrap",
        description:
          "Paneer, crunchy vegetables and smoky Mexican sauce in a soft wrap.",
        price: 110,
        category: "Rolls & Wraps",
        isAvailable: true,
        preparationTime: 11,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Peri Peri Momos",
        description:
          "Steamed vegetable momos tossed in spicy peri peri seasoning.",
        price: 85,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Crispy Paneer Burger",
        description:
          "Crunchy paneer patty with lettuce, cheese and smoky sauce.",
        price: 120,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 12,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Cheesy Garlic Bread",
        description:
          "Toasted garlic bread finished with melted cheese and herbs.",
        price: 75,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 7,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Chocolate Shake",
        description:
          "Thick chilled chocolate shake with a rich cocoa flavour.",
        price: 90,
        category: "Chilled Drinks",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["Bite Box"],
        name: "Brownie Sundae",
        description:
          "Warm chocolate brownie paired with vanilla ice cream.",
        price: 110,
        category: "Desserts",
        isAvailable: true,
        preparationTime: 5,
      },

      // =====================================================
      // =====================================================
      // CAFEMONK
      // 7 COMMON + 7 UNIQUE
      // =====================================================
      // =====================================================

      // ---------- COMMON COMPETITION ITEMS ----------

      {
        canteen: canteenMap["CafeMonk"],
        name: "Masala Chai",
        description:
          "Freshly brewed Indian tea with aromatic spices.",
        price: 30,
        category: "Chai & Beverages",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Cold Coffee",
        description:
          "Smooth chilled coffee with a creamy finish.",
        price: 80,
        category: "Chai & Beverages",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Veg Burger",
        description:
          "Crispy vegetable patty with lettuce, tomato and house sauce.",
        price: 85,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Paneer Roll",
        description:
          "Grilled paneer and vegetables wrapped in a soft roll.",
        price: 95,
        category: "Rolls & Wraps",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Veg Grilled Sandwich",
        description:
          "Crispy grilled sandwich with vegetables and melted cheese.",
        price: 90,
        category: "Sandwiches",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Samosa",
        description:
          "Classic crispy samosa filled with seasoned potatoes.",
        price: 25,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Masala Dosa",
        description:
          "Crispy South Indian dosa with potato masala and chutney.",
        price: 75,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 12,
      },

      // ---------- CAFEMONK SPECIALS ----------

      {
        canteen: canteenMap["CafeMonk"],
        name: "Cappuccino",
        description:
          "Espresso balanced with steamed milk and silky foam.",
        price: 90,
        category: "Coffee",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Cafe Latte",
        description:
          "Smooth espresso with creamy steamed milk.",
        price: 95,
        category: "Coffee",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Mocha",
        description:
          "Rich coffee blended with chocolate and steamed milk.",
        price: 110,
        category: "Coffee",
        isAvailable: true,
        preparationTime: 7,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Peri Peri Paneer Sandwich",
        description:
          "Grilled sandwich with paneer, cheese and peri peri seasoning.",
        price: 105,
        category: "Sandwiches",
        isAvailable: true,
        preparationTime: 9,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Cheese Garlic Toast",
        description:
          "Crunchy garlic toast topped with melted cheese.",
        price: 70,
        category: "Quick Bites",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Blueberry Cheesecake",
        description:
          "Creamy cheesecake with a light blueberry topping.",
        price: 125,
        category: "Desserts",
        isAvailable: true,
        preparationTime: 4,
      },
      {
        canteen: canteenMap["CafeMonk"],
        name: "Chocolate Chip Cookie",
        description:
          "Freshly baked cookie with generous chocolate chips.",
        price: 45,
        category: "Desserts",
        isAvailable: true,
        preparationTime: 3,
      },

      // =====================================================
      // =====================================================
      // CHAIGARAM
      // 7 COMMON + 7 UNIQUE
      // =====================================================
      // =====================================================

      // ---------- COMMON COMPETITION ITEMS ----------

      {
        canteen: canteenMap["ChaiGaram"],
        name: "Masala Chai",
        description:
          "Strong aromatic tea brewed with traditional Indian spices.",
        price: 20,
        category: "Chai",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Cold Coffee",
        description:
          "Chilled coffee with a smooth and creamy finish.",
        price: 65,
        category: "Beverages",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Veg Burger",
        description:
          "Classic crispy veg burger with fresh vegetables and sauce.",
        price: 75,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Paneer Roll",
        description:
          "Spiced paneer and vegetables wrapped in a soft roll.",
        price: 85,
        category: "Rolls",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Veg Grilled Sandwich",
        description:
          "Toasted vegetable sandwich with cheese and herbs.",
        price: 80,
        category: "Sandwiches",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Samosa",
        description:
          "Fresh crispy samosa with a spicy potato filling.",
        price: 15,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Masala Dosa",
        description:
          "Crispy dosa with potato masala, sambar and chutney.",
        price: 65,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 12,
      },

      // ---------- CHAIGARAM SPECIALS ----------

      {
        canteen: canteenMap["ChaiGaram"],
        name: "Ginger Chai",
        description:
          "Hot tea infused with fresh ginger.",
        price: 25,
        category: "Chai",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Elaichi Chai",
        description:
          "Fragrant cardamom tea with a naturally sweet aroma.",
        price: 25,
        category: "Chai",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Kulhad Chai",
        description:
          "Traditional hot chai served in a clay kulhad.",
        price: 30,
        category: "Chai",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Aloo Pyaz Paratha",
        description:
          "Crispy stuffed paratha served with curd and chutney.",
        price: 70,
        category: "Breakfast",
        isAvailable: true,
        preparationTime: 12,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Chole Bhature",
        description:
          "Spiced chickpeas served with fluffy bhature.",
        price: 100,
        category: "Meals",
        isAvailable: true,
        preparationTime: 15,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Aloo Samosa Chaat",
        description:
          "Crispy samosas topped with chutneys, curd and spices.",
        price: 50,
        category: "Chaat",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["ChaiGaram"],
        name: "Kesar Badam Milk",
        description:
          "Chilled milk infused with saffron and crushed almonds.",
        price: 75,
        category: "Beverages",
        isAvailable: true,
        preparationTime: 5,
      },

      // =====================================================
      // =====================================================
      // DOSTEA
      // 7 COMMON + 7 UNIQUE
      // =====================================================
      // =====================================================

      // ---------- COMMON COMPETITION ITEMS ----------

      {
        canteen: canteenMap["DosTea"],
        name: "Masala Chai",
        description:
          "Hot Indian tea with aromatic spices.",
        price: 25,
        category: "Tea",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Cold Coffee",
        description:
          "Chilled creamy coffee served cold.",
        price: 70,
        category: "Beverages",
        isAvailable: true,
        preparationTime: 6,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Veg Burger",
        description:
          "Crispy veg patty with vegetables and signature sauce.",
        price: 80,
        category: "Burgers",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Paneer Roll",
        description:
          "Paneer, onions and vegetables wrapped in a soft roll.",
        price: 90,
        category: "Rolls",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Veg Grilled Sandwich",
        description:
          "Grilled vegetables and cheese in toasted bread.",
        price: 85,
        category: "Sandwiches",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Samosa",
        description:
          "Crispy potato-filled samosa served hot.",
        price: 20,
        category: "Snacks",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Masala Dosa",
        description:
          "Golden crispy dosa with potato masala and chutneys.",
        price: 65,
        category: "Dosa",
        isAvailable: true,
        preparationTime: 12,
      },

      // ---------- DOSTEA SPECIALS ----------

      {
        canteen: canteenMap["DosTea"],
        name: "Paneer Dosa",
        description:
          "Crispy dosa stuffed with spiced paneer and vegetables.",
        price: 95,
        category: "Dosa",
        isAvailable: true,
        preparationTime: 14,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Mysore Masala Dosa",
        description:
          "Crispy dosa coated with spicy Mysore chutney and potato masala.",
        price: 90,
        category: "Dosa",
        isAvailable: true,
        preparationTime: 14,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Idli Sambar",
        description:
          "Soft steamed idlis served with hot sambar and chutney.",
        price: 55,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 8,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Medu Vada",
        description:
          "Crispy South Indian lentil fritters served with sambar.",
        price: 60,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 9,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Uttapam",
        description:
          "Soft thick dosa topped with onions, tomatoes and herbs.",
        price: 75,
        category: "South Indian",
        isAvailable: true,
        preparationTime: 10,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Filter Coffee",
        description:
          "Traditional South Indian filter coffee with a rich aroma.",
        price: 40,
        category: "Coffee",
        isAvailable: true,
        preparationTime: 5,
      },
      {
        canteen: canteenMap["DosTea"],
        name: "Ghee Podi Dosa",
        description:
          "Crispy dosa finished with ghee and aromatic podi spice.",
        price: 100,
        category: "Dosa",
        isAvailable: true,
        preparationTime: 13,
      },
    ];

    const created = await MenuItem.insertMany(menuItems);

    console.log(
      `Created ${created.length} menu items across ${canteens.length} canteens`
    );

    // Print a clean summary
    for (const canteen of canteens) {
      const count = created.filter(
        (item) =>
          item.canteen.toString() === canteen._id.toString()
      ).length;

      console.log(`✓ ${canteen.name}: ${count} items`);
    }

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