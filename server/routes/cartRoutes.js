const express = require('express');
const router = express.Router();
const { getCart, saveCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCart);
router.post('/', saveCart);

module.exports = router;
