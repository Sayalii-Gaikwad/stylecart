const dbService = require('../models/dbService');

const populateCartItems = async (cart) => {
  if (!cart) return null;
  
  // Convert mongoose document to plain object if necessary
  const cartObj = cart.toObject ? cart.toObject() : JSON.parse(JSON.stringify(cart));
  
  const populatedItems = [];
  for (const item of cartObj.items) {
    const product = await dbService.getProductById(item.productId);
    if (product) {
      populatedItems.push({
        _id: item._id,
        productId: product,
        quantity: item.quantity,
        size: item.size
      });
    }
  }
  
  return {
    ...cartObj,
    items: populatedItems
  };
};

exports.getCart = async (req, res) => {
  try {
    const cart = await dbService.getCart(req.user.id);
    const populated = await populateCartItems(cart);
    res.json(populated);
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ message: 'Server error retrieving cart' });
  }
};

exports.saveCart = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    const cleanedItems = items.map(item => ({
      productId: item.productId,
      quantity: parseInt(item.quantity) || 1,
      size: item.size
    }));

    const cart = await dbService.saveCart(req.user.id, cleanedItems);
    const populated = await populateCartItems(cart);
    res.json(populated);
  } catch (error) {
    console.error('Error saving cart:', error.message);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};
