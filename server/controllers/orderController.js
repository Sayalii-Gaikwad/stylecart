const dbService = require('../models/dbService');

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const orderData = {
      userId: req.user.id,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        size: item.size
      })),
      totalAmount: parseFloat(totalAmount),
      shippingAddress,
      paymentStatus: 'Paid', // Fake payment success simulation
      orderStatus: 'Pending'
    };

    const newOrder = await dbService.createOrder(orderData);
    
    // Clear user's cart after successful order creation
    await dbService.saveCart(req.user.id, []);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await dbService.getOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    res.status(500).json({ message: 'Server error retrieving orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await dbService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error retrieving all orders:', error.message);
    res.status(500).json({ message: 'Server error retrieving all orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ message: 'Please provide order status' });
    }

    const updatedOrder = await dbService.updateOrderStatus(req.params.id, orderStatus);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error updating order' });
  }
};
