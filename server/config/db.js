const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stylecart';
    console.log(`Attempting to connect to MongoDB at: ${connUri}...`);
    
    mongoose.set('strictQuery', false);
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    global.useFallback = false;
  } catch (error) {
    console.warn('\n==================================================================');
    console.warn('WARNING: MongoDB connection failed!');
    console.warn(`Error: ${error.message}`);
    console.warn('FALLBACK: Server will use a local JSON file for database storage.');
    console.warn('==================================================================\n');
    global.useFallback = true;
    initializeFallbackDb();
  }
};

const initializeFallbackDb = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, 'fallback_db.json');
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      users: [],
      products: [],
      carts: [],
      orders: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log(`Initialized fallback database file at: ${dbPath}`);
  }
};

module.exports = { connectDB };
