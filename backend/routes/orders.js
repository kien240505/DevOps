const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Public route to create order
router.post('/', orderController.createOrder);

// Mock payment route
router.post('/:id/pay', orderController.processPayment);

// Customer order history, completion, and cancellation
router.get('/mine', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/:id/complete', verifyToken, orderController.completeUserOrder);
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

// Protected routes (Admin only)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id', verifyToken, isAdmin, orderController.updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, orderController.deleteOrder);

module.exports = router;
