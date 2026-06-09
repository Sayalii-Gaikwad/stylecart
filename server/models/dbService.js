const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/fallback_db.json');

const readFallbackDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialData = { users: [], products: [], carts: [], orders: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading fallback db:', err);
    return { users: [], products: [], carts: [], orders: [] };
  }
};

const writeFallbackDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing fallback db:', err);
  }
};

const generateObjectId = () => {
  return Array.from({ length: 24 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const dbService = {
  // --- USER OPERATIONS ---
  async getUserById(id) {
    if (global.useFallback) {
      const db = readFallbackDb();
      return db.users.find(u => u._id === id.toString()) || null;
    }
    return await User.findById(id);
  },

  async getUserByEmail(email) {
    if (global.useFallback) {
      const db = readFallbackDb();
      return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    return await User.findOne({ email });
  },

  async createUser(userData) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const newUser = {
        _id: generateObjectId(),
        ...userData,
        isAdmin: userData.isAdmin || false,
        createdAt: new Date()
      };
      db.users.push(newUser);
      writeFallbackDb(db);
      return newUser;
    }
    return await User.create(userData);
  },

  // --- PRODUCT OPERATIONS ---
  async getProducts({ category, search, sort, priceMin, priceMax } = {}) {
    if (global.useFallback) {
      const db = readFallbackDb();
      let list = [...db.products];

      if (category && category !== 'all') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const query = search.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query)
        );
      }

      if (priceMin !== undefined && priceMin !== '') {
        list = list.filter(p => p.price >= parseFloat(priceMin));
      }

      if (priceMax !== undefined && priceMax !== '') {
        list = list.filter(p => p.price <= parseFloat(priceMax));
      }

      if (sort) {
        if (sort === 'price-asc') {
          list.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
          list.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        } else {
          list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
      }

      return list;
    }

    // MongoDB Mongoose query
    let query = {};
    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (priceMin !== undefined && priceMin !== '' || priceMax !== undefined && priceMax !== '') {
      query.price = {};
      if (priceMin !== undefined && priceMin !== '') query.price.$gte = parseFloat(priceMin);
      if (priceMax !== undefined && priceMax !== '') query.price.$lte = parseFloat(priceMax);
    }

    let mongooseQuery = Product.find(query);

    if (sort) {
      if (sort === 'price-asc') mongooseQuery = mongooseQuery.sort({ price: 1 });
      else if (sort === 'price-desc') mongooseQuery = mongooseQuery.sort({ price: -1 });
      else if (sort === 'rating') mongooseQuery = mongooseQuery.sort({ rating: -1 });
      else mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
    }

    return await mongooseQuery;
  },

  async getProductById(id) {
    if (global.useFallback) {
      const db = readFallbackDb();
      return db.products.find(p => p._id === id.toString()) || null;
    }
    return await Product.findById(id);
  },

  async createProduct(productData) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const newProduct = {
        _id: generateObjectId(),
        ...productData,
        price: parseFloat(productData.price),
        originalPrice: parseFloat(productData.originalPrice || productData.price),
        discount: parseInt(productData.discount || 0),
        stock: parseInt(productData.stock || 10),
        rating: parseFloat(productData.rating || 4.5),
        reviewsCount: parseInt(productData.reviewsCount || 0),
        createdAt: new Date()
      };
      db.products.push(newProduct);
      writeFallbackDb(db);
      return newProduct;
    }
    return await Product.create(productData);
  },

  async updateProduct(id, productData) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const index = db.products.findIndex(p => p._id === id.toString());
      if (index === -1) return null;
      db.products[index] = {
        ...db.products[index],
        ...productData,
        price: parseFloat(productData.price ?? db.products[index].price),
        originalPrice: parseFloat(productData.originalPrice ?? db.products[index].originalPrice),
        discount: parseInt(productData.discount ?? db.products[index].discount),
        stock: parseInt(productData.stock ?? db.products[index].stock)
      };
      writeFallbackDb(db);
      return db.products[index];
    }
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  },

  async deleteProduct(id) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const index = db.products.findIndex(p => p._id === id.toString());
      if (index === -1) return null;
      const deleted = db.products.splice(index, 1)[0];
      writeFallbackDb(db);
      return deleted;
    }
    return await Product.findByIdAndDelete(id);
  },

  // --- CART OPERATIONS ---
  async getCart(userId) {
    if (global.useFallback) {
      const db = readFallbackDb();
      let cart = db.carts.find(c => c.userId === userId.toString());
      if (!cart) {
        cart = { userId: userId.toString(), items: [], updatedAt: new Date() };
        db.carts.push(cart);
        writeFallbackDb(db);
      }
      return cart;
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    return cart;
  },

  async saveCart(userId, items) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const index = db.carts.findIndex(c => c.userId === userId.toString());
      const updatedCart = {
        userId: userId.toString(),
        items: items.map(item => ({
          productId: item.productId.toString(),
          quantity: parseInt(item.quantity),
          size: item.size
        })),
        updatedAt: new Date()
      };
      if (index === -1) {
        db.carts.push(updatedCart);
      } else {
        db.carts[index] = updatedCart;
      }
      writeFallbackDb(db);
      return updatedCart;
    }
    return await Cart.findOneAndUpdate(
      { userId },
      { items, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  },

  // --- ORDER OPERATIONS ---
  async getOrders(userId) {
    if (global.useFallback) {
      const db = readFallbackDb();
      return db.orders.filter(o => o.userId === userId.toString()).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return await Order.find({ userId }).sort({ createdAt: -1 });
  },

  async getAllOrders() {
    if (global.useFallback) {
      const db = readFallbackDb();
      return [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return await Order.find({}).sort({ createdAt: -1 });
  },

  async createOrder(orderData) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const newOrder = {
        _id: generateObjectId(),
        ...orderData,
        userId: orderData.userId.toString(),
        createdAt: new Date(),
        paymentStatus: orderData.paymentStatus || 'Paid',
        orderStatus: orderData.orderStatus || 'Pending'
      };
      db.orders.push(newOrder);
      writeFallbackDb(db);
      return newOrder;
    }
    return await Order.create(orderData);
  },

  async updateOrderStatus(orderId, status) {
    if (global.useFallback) {
      const db = readFallbackDb();
      const index = db.orders.findIndex(o => o._id === orderId.toString());
      if (index === -1) return null;
      db.orders[index].orderStatus = status;
      writeFallbackDb(db);
      return db.orders[index];
    }
    return await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
  }
};

module.exports = dbService;
