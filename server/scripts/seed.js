const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const { connectDB } = require('../config/db');

const seedProducts = [
  {
    name: "Men's Black Typography Printed T-Shirt",
    price: 399,
    originalPrice: 999,
    discount: 60,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=60",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    description: "Upgrade your style with this classic typography print cotton t-shirt. Features ultra-soft combed cotton fabric, round neck design, and durable printing. Perfect for casual wear.",
    stock: 15,
    rating: 4.3,
    reviewsCount: 120
  },
  {
    name: "Men's Olive Green Slim Fit Cargo Pants",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&auto=format&fit=crop&q=60",
    category: "men",
    sizes: ["M", "L", "XL"],
    description: "Rugged and functional slim-fit cargo pants in a versatile olive green. Designed with multi-pocket utility, comfortable cotton twill, and a tapered fit.",
    stock: 8,
    rating: 4.5,
    reviewsCount: 85
  },
  {
    name: "Men's Classic Wash Navy Denim Jacket",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=500&auto=format&fit=crop&q=60",
    category: "men",
    sizes: ["M", "L", "XL"],
    description: "The timeless classic denim jacket. Made from heavy-duty durable denim, features premium metal buttons, double breast pockets, and hand-warmer pockets.",
    stock: 12,
    rating: 4.7,
    reviewsCount: 42
  },
  {
    name: "Women's Pastel Pink Oversized Cozy Hoodie",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60",
    category: "women",
    sizes: ["S", "M", "L"],
    description: "Stay warm and look cute with this relaxed-fit oversized hoodie. Features premium warm fleece lining, drawstrings, and a kangaroo pouch pocket.",
    stock: 20,
    rating: 4.4,
    reviewsCount: 150
  },
  {
    name: "Women's Floral Printed Retro A-Line Dress",
    price: 699,
    originalPrice: 1399,
    discount: 50,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60",
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    description: "A breezy floral printed summer dress featuring an A-line shape, flattering neck design, and lightweight breathable viscose fabric. Ideal for brunch dates.",
    stock: 10,
    rating: 4.6,
    reviewsCount: 95
  },
  {
    name: "Women's High Rise Stretchable Slim Jeans",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
    category: "women",
    sizes: ["S", "M", "L"],
    description: "Sculpting high-waisted denim jeans with comfortable stretch. Skinny leg opening, classic five pocket style, and a secure button-fly closure.",
    stock: 14,
    rating: 4.2,
    reviewsCount: 64
  },
  {
    name: "Unisex Retro Round Metal Sunglasses",
    price: 299,
    originalPrice: 799,
    discount: 62,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60",
    category: "accessories",
    sizes: ["Regular"],
    description: "Vibe retro with these lightweight, UV-protected round sunglasses. Features a sleek golden metal frame and comfortable nose pads.",
    stock: 30,
    rating: 4.1,
    reviewsCount: 210
  },
  {
    name: "Premium Canvas Utility Backpack Black",
    price: 599,
    originalPrice: 1199,
    discount: 50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    category: "accessories",
    sizes: ["Regular"],
    description: "Your daily carry sorted. Durable canvas construction, internal padded 15-inch laptop sleeve, front organizer pocket, and ergonomic shoulder straps.",
    stock: 25,
    rating: 4.5,
    reviewsCount: 78
  },
  {
    name: "Minimalist Classic Analog Quartz Watch",
    price: 899,
    originalPrice: 1999,
    discount: 55,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    category: "accessories",
    sizes: ["Regular"],
    description: "A sleek quartz movement watch with a black dial and light brown faux-leather strap. Water resistant and perfect for both formal and casual settings.",
    stock: 15,
    rating: 4.8,
    reviewsCount: 36
  }
];

const seedDB = async () => {
  // 1. Seed the Fallback JSON database file
  const fallbackDbPath = path.join(__dirname, '../data/fallback_db.json');
  const dataDir = path.dirname(fallbackDbPath);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Generate fallback products with simulated ObjectId format
  const generateObjectId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const fallbackProducts = seedProducts.map(p => ({
    _id: generateObjectId(),
    ...p,
    createdAt: new Date()
  }));

  let dbData = { users: [], products: [], carts: [], orders: [] };
  if (fs.existsSync(fallbackDbPath)) {
    try {
      dbData = JSON.parse(fs.readFileSync(fallbackDbPath, 'utf8'));
    } catch (e) {
      // ignore
    }
  }

  dbData.products = fallbackProducts;
  // Let's also create an admin user in fallback db if not exists for easy testing
  const existingAdmin = dbData.users.find(u => u.email === 'admin@stylecart.com');
  if (!existingAdmin) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    dbData.users.push({
      _id: generateObjectId(),
      name: "Admin User",
      email: "admin@stylecart.com",
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date()
    });
    console.log("Added default Admin user to Fallback DB (email: admin@stylecart.com, pass: admin123)");
  }

  fs.writeFileSync(fallbackDbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('Fallback local database seeded successfully!');

  // 2. Seed Mongoose MongoDB if available
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stylecart';
  console.log(`Connecting to MongoDB for seeding at: ${connUri}...`);
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2000 });
    
    // Clear products
    await Product.deleteMany({});
    console.log('Cleared existing MongoDB products.');

    // Insert new products
    await Product.insertMany(seedProducts);
    console.log('Seeded MongoDB products successfully.');
    
    // Check if admin user exists in MongoDB User collection, if not add it
    const User = require('../models/User');
    const existingMongoAdmin = await User.findOne({ email: 'admin@stylecart.com' });
    if (!existingMongoAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: "Admin User",
        email: "admin@stylecart.com",
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Added default Admin user to MongoDB.");
    }
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.warn(`Could not seed MongoDB: ${error.message} (ignoring, fallback JSON database has been seeded)`);
  }
  
  process.exit();
};

seedDB();
