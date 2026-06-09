const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true }, // men, women, accessories
  sizes: [{ type: String }], // S, M, L, XL
  description: { type: String, required: true },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
