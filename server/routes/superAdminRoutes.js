import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/UserModel.js';
import Coupon from "../models/imp/coupon.js";

import Order from '../models/imp/Order.js';

const router = express.Router();

/* -------------------- SUPER ADMIN GUARD -------------------- */
const superAdminOnly = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super Admin access only' });
  }
  next();
};

/* ==================== ADMIN MANAGEMENT ==================== */

// Get all admins
router.get('/admins', protect, superAdminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});

// Update admin permissions
router.put('/admins/:id/permissions', protect, superAdminOnly, async (req, res) => {
  try {
    const { permissions } = req.body;
    await User.findByIdAndUpdate(req.params.id, { permissions });
    res.json({ message: 'Admin permissions updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update permissions' });
  }
});

// Set admin service charge
router.put('/admins/:id/service-charge', protect, superAdminOnly, async (req, res) => {
  try {
    const { percent } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      serviceChargePercent: percent,
    });
    res.json({ message: 'Service charge updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service charge' });
  }
});

// Block / Unblock admin
router.put('/admins/:id/status', protect, superAdminOnly, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isBlocked });
    res.json({ message: 'Admin status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update admin status' });
  }
});

/* ==================== COUPON MANAGEMENT ==================== */

// Create coupon
router.post('/coupons', protect, superAdminOnly, async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create coupon' });
  }
});

// Get all coupons
router.get('/coupons', protect, superAdminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
});

// Delete coupon
router.delete('/coupons/:id', protect, superAdminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
});

/* ==================== ORDER / PAYMENT MANAGEMENT ==================== */

// Get all orders (Hotel + Transport)
router.get('/orders', protect, superAdminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get total revenue & commission (Super Admin Dashboard)
router.get('/orders/stats', protect, superAdminOnly, async (req, res) => {
  try {
    const orders = await Order.find();

    const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCommission = orders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0);

    res.json({
      totalOrders: orders.length,
      totalAmount,
      totalCommission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order statistics' });
  }
});

export default router;




