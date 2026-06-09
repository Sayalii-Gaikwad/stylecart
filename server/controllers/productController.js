const dbService = require('../models/dbService');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, priceMin, priceMax } = req.query;
    const products = await dbService.getProducts({
      category,
      search,
      sort,
      priceMin,
      priceMax
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await dbService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).json({ message: 'Server error retrieving product details' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, discount, image, category, sizes, description, stock } = req.body;

    if (!name || !price || !image || !category || !description) {
      return res.status(400).json({ message: 'Please enter all required fields: name, price, image, category, description' });
    }

    const product = await dbService.createProduct({
      name,
      price,
      originalPrice: originalPrice || price,
      discount: discount || 0,
      image,
      category,
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      description,
      stock: stock || 10
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await dbService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or update failed' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await dbService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
