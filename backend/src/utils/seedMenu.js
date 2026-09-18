const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Canteen = require("../models/Canteen");
const MenuItem = require("../models/MenuItem");

// --------------------------------------------------
// FOOD IMAGES
// --------------------------------------------------

const images = {
  // Common items
  "Masala Chai":
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",

  "Cold Coffee":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",

  "Veg Burger":
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",

  "Paneer Roll":
    "https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-Featured-1-500x500.jpg",

  "Veg Grilled Sandwich":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",

  "Samosa":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",

  "Masala Dosa":
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",

  // Bite Box
  "Loaded Cheese Fries":
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",

  "Mexican Paneer Wrap":
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80",

  "Peri Peri Momos":
    "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80",

  "Crispy Paneer Burger":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",

  "Chole Bhature":
    "https://www.spiceupthecurry.com/wp-content/uploads/2015/03/Chole-bhature-1.jpg",

  "Chocolate Shake":
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",

  "Pastry":
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",

  // CafeMonk
  "Cappuccino":
    "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=80",

  "Cafe Latte":
    "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=900&q=80",

  "Mocha":
    "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=900&q=80",

  "Peri Peri Paneer Sandwich":
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=900&q=80",

  "Cheese Garlic Toast":
    "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=80",

  "Blueberry Cheesecake":
    "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",

  "Chocolate Chip Cookie":
    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",

  // ChaiGaram
  "Ginger Chai":
    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=900&q=80",

  "Elaichi Chai":
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80",

  "Kulhad Chai":
    "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=900&q=80",

  "Aloo Pyaz Paratha":
    "https://images.unsplash.com/photo-1626132647523-66f0bf380027?auto=format&fit=crop&w=900&q=80",

  "Chole Bhature":
    "https://www.spiceupthecurry.com/wp-content/uploads/2015/03/Chole-bhature-1.jpg",

  "Aloo Samosa Chaat":
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80",

  "Kesar Badam Milk":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",

  // DosTea
  "Paneer Dosa":
    "https://www.cookclickndevour.com/wp-content/uploads/2019/01/paneer-masala-dosa-recipe-1.jpg" ,

  "Mysore Masala Dosa":
    "https://myfoodstory.com/wp-content/uploads/2025/08/Mysore-Masala-Dosa-Recipe-3.jpg",

  "Idli Sambar":
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",

  "Medu Vada":
    "https://thumbs.dreamstime.com/b/delicious-south-indian-dish-medu-vada-serving-chutney-sambar-traditional-breakfast-photo-plate-crispy-golden-made-405438107.jpg",

  "Uttapam":
    "https://i.pinimg.com/736x/cc/62/65/cc62655bcca201ea0ddcc1b7524ba173.jpg",

  "Filter Coffee":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",

  "Ghee Podi Dosa":
    "https://www.shutterstock.com/image-photo/dosa-ghee-roast-coconut-chutney-260nw-2484376905.jpg",
};

// --------------------------------------------------
// MENU DATA
// --------------------------------------------------

const menuByCanteen = {
  "Bite Box": [
    ["Masala Chai", "Hot Indian tea with aromatic spices", 25, "Beverages", 5],
    ["Cold Coffee", "Chilled creamy cold coffee", 70, "Beverages", 8],
    ["Veg Burger", "Crispy veg patty with fresh vegetables", 80, "Burgers", 10],
    ["Paneer Roll", "Spicy paneer wrapped in soft flatbread", 90, "Rolls", 10],
    ["Veg Grilled Sandwich", "Grilled sandwich loaded with vegetables", 75, "Sandwiches", 8],
    ["Samosa", "Crispy samosa with spicy potato filling", 20, "Snacks", 5],
    ["Masala Dosa", "Crispy dosa with masala potato filling", 80, "South Indian", 12],

    ["Loaded Cheese Fries", "Crispy fries topped with cheese", 100, "Snacks", 10],
    ["Mexican Paneer Wrap", "Paneer wrap with Mexican-style seasoning", 110, "Rolls", 12],
    ["Peri Peri Momos", "Steamed momos tossed in peri peri seasoning", 100, "Momos", 12],
    ["Crispy Paneer Burger", "Crunchy paneer patty with creamy sauce", 120, "Burgers", 12],
    ["Chole Bhature", "Authentic Delhi's Chole Bhature", 90, "Snacks", 8],
    ["Chocolate Shake", "Rich chilled chocolate milkshake", 100, "Beverages", 8],
    ["Pastry", "Delicious Pineapple Pastry", 50, "Desserts", 10],
  ],

  CafeMonk: [
    ["Masala Chai", "Classic Indian tea with spices", 30, "Beverages", 5],
    ["Cold Coffee", "Smooth chilled coffee", 80, "Beverages", 8],
    ["Veg Burger", "Fresh vegetable burger with creamy sauce", 85, "Burgers", 10],
    ["Paneer Roll", "Grilled paneer wrapped with vegetables", 95, "Rolls", 10],
    ["Veg Grilled Sandwich", "Golden grilled vegetable sandwich", 80, "Sandwiches", 8],
    ["Samosa", "Crispy potato-filled samosa", 25, "Snacks", 5],
    ["Masala Dosa", "Crispy dosa served with masala filling", 90, "South Indian", 12],

    ["Cappuccino", "Rich espresso topped with steamed milk foam", 110, "Coffee", 7],
    ["Cafe Latte", "Smooth espresso with creamy milk", 120, "Coffee", 7],
    ["Mocha", "Chocolate espresso with steamed milk", 130, "Coffee", 8],
    ["Peri Peri Paneer Sandwich", "Grilled paneer sandwich with peri peri sauce", 120, "Sandwiches", 10],
    ["Cheese Garlic Toast", "Crispy toast topped with cheese and garlic", 100, "Snacks", 8],
    ["Blueberry Cheesecake", "Creamy cheesecake with blueberry topping", 150, "Desserts", 12],
    ["Chocolate Chip Cookie", "Fresh baked chocolate chip cookie", 60, "Desserts", 5],
  ],

  ChaiGaram: [
    ["Masala Chai", "Strong masala chai with Indian spices", 20, "Beverages", 5],
    ["Cold Coffee", "Classic chilled cold coffee", 65, "Beverages", 8],
    ["Veg Burger", "Classic vegetable burger", 75, "Burgers", 10],
    ["Paneer Roll", "Spicy paneer roll with fresh onions", 85, "Rolls", 10],
    ["Veg Grilled Sandwich", "Crispy grilled vegetable sandwich", 70, "Sandwiches", 8],
    ["Samosa", "Fresh crispy potato samosa", 15, "Snacks", 5],
    ["Masala Dosa", "South Indian crispy masala dosa", 75, "South Indian", 12],

    ["Ginger Chai", "Tea infused with fresh ginger", 25, "Beverages", 5],
    ["Elaichi Chai", "Aromatic cardamom tea", 25, "Beverages", 5],
    ["Kulhad Chai", "Traditional tea served in a kulhad", 30, "Beverages", 5],
    ["Aloo Pyaz Paratha", "Stuffed potato and onion paratha", 70, "Breakfast", 10],
    ["Chole Bhature", "Spicy chickpeas with fluffy bhature", 100, "North Indian", 15],
    ["Aloo Samosa Chaat", "Samosa topped with chutneys and spices", 60, "Chaat", 8],
    ["Kesar Badam Milk", "Chilled saffron almond milk", 90, "Beverages", 7],
  ],

  DosTea: [
    ["Masala Chai", "Classic hot masala tea", 25, "Beverages", 5],
    ["Cold Coffee", "Refreshing chilled coffee", 75, "Beverages", 8],
    ["Veg Burger", "Crispy vegetable patty burger", 80, "Burgers", 10],
    ["Paneer Roll", "Paneer roll with spicy filling", 90, "Rolls", 10],
    ["Veg Grilled Sandwich", "Grilled sandwich with fresh vegetables", 75, "Sandwiches", 8],
    ["Samosa", "Crispy spicy potato samosa", 20, "Snacks", 5],
    ["Masala Dosa", "Crispy dosa with potato masala", 85, "South Indian", 12],

    ["Paneer Dosa", "Dosa stuffed with spicy paneer filling", 110, "South Indian", 12],
    ["Mysore Masala Dosa", "Spicy Mysore-style masala dosa", 105, "South Indian", 12],
    ["Idli Sambar", "Soft idlis served with hot sambar", 70, "South Indian", 10],
    ["Medu Vada", "Crispy South Indian lentil fritters", 65, "South Indian", 8],
    ["Uttapam", "Thick dosa topped with fresh vegetables", 85, "South Indian", 10],
    ["Filter Coffee", "Traditional South Indian filter coffee", 55, "Beverages", 5],
    ["Ghee Podi Dosa", "Crispy dosa with ghee and podi", 100, "South Indian", 10],
  ],
};

// --------------------------------------------------
// SEED FUNCTION
// --------------------------------------------------

const seedMenu = async () => {
  try {
    await connectDB();

    const canteens = await Canteen.find({
      name: {
        $in: ["Bite Box", "CafeMonk", "ChaiGaram", "DosTea"],
      },
    });

    if (canteens.length !== 4) {
      throw new Error(
        `Expected 4 canteens, but found ${canteens.length}. Run seedCanteens.js first.`
      );
    }

    // Remove existing menu items for these canteens
    await MenuItem.deleteMany({
      canteen: { $in: canteens.map((canteen) => canteen._id) },
    });

    const menuItems = [];

    for (const canteen of canteens) {
      const items = menuByCanteen[canteen.name];

      if (!items) {
        console.log(`No menu data found for ${canteen.name}`);
        continue;
      }

      for (const [
        name,
        description,
        price,
        category,
        preparationTime,
      ] of items) {
        menuItems.push({
          canteen: canteen._id,
          name,
          description,
          price,
          category,
          preparationTime,
          image: images[name] || "",
          isAvailable: true,
        });
      }
    }

    const createdItems = await MenuItem.insertMany(menuItems);

    console.log("\n========================================");
    console.log("        MENU SEED COMPLETED");
    console.log("========================================");
    console.log(`Total menu items: ${createdItems.length}`);
    console.log(`Canteens: ${canteens.length}`);

    for (const canteen of canteens) {
      const count = createdItems.filter(
        (item) => item.canteen.toString() === canteen._id.toString()
      ).length;

      console.log(`✓ ${canteen.name}: ${count} items`);
    }

    console.log("========================================\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Menu seed failed:");
    console.error(error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedMenu();