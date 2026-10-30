const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Authentication & Registration
router.post('/register', authController.register);
router.post('/login', authController.login);

// Password recovery & Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Profile routes
router.get('/profile', verifyToken, authController.getProfile);
router.get('/me', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);

// Protect GET and DELETE users with JWT and admin role
router.get('/users', verifyToken, isAdmin, authController.getUsers);
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);

module.exports = router;
