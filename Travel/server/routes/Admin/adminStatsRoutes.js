import express from 'express';
import { auth, verifyAdmin, verifySuperAdmin } from '../../middleware/auth.js';
import Agency from '../../models/Agency.js';
import User from '../../models/UserModel.js';
import Hotel from '../../models/hotel.js';
import Transport from '../../models/transport.js';
import TouristSpot from '../../models/TouristSpot.js';

const router = express.Router();

/* =====================================================
   📊 BASIC ADMIN DASHBOARD STATS (Admin + Super Admin)
===================================================== */
router.get('/overview', auth, verifyAdmin, async (req, res) => {
  try {
    const [totalUsers, totalHotels, totalTransports, totalSpots, totalAgencies] = await Promise.all(
      [
        User.countDocuments(),
        Hotel.countDocuments(),
        Transport.countDocuments(),
        TouristSpot.countDocuments(),
        Agency.countDocuments(),
      ],
    );

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalHotels,
        totalTransports,
        totalSpots,
        totalAgencies,
      },
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* =====================================================
   💰 TRANSACTION & REVENUE STATS (SUPER ADMIN ONLY)
===================================================== */
router.get('/revenue', auth, verifySuperAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find();

    let totalRevenue = 0;
    let serviceCharge = 0;

    transactions.forEach((t) => {
      totalRevenue += t.amount;
      serviceCharge += t.serviceCharge || 0;
    });

    res.json({
      success: true,
      revenue: {
        totalRevenue,
        serviceCharge,
        netRevenue: totalRevenue - serviceCharge,
      },
    });
  } catch (error) {
    console.error('Revenue stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* =====================================================
   👥 USER ROLE DISTRIBUTION
===================================================== */
router.get('/users', auth, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ isAdmin: true });
    const normalUsers = totalUsers - admins;

    res.json({
      success: true,
      users: {
        totalUsers,
        admins,
        normalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* =====================================================
   🏨 HOTEL & 🚕 TRANSPORT PERFORMANCE
===================================================== */
router.get('/resources', auth, verifyAdmin, async (req, res) => {
  try {
    const hotelsAvailable = await Hotel.countDocuments({ availability: true });
    const transportAvailable = await Transport.countDocuments({ availability: true });

    res.json({
      success: true,
      resources: {
        hotelsAvailable,
        transportAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* =====================================================
   🌍 MOST POPULAR TOURIST SPOTS (By Likes)
===================================================== */
router.get('/popular-spots', auth, verifyAdmin, async (req, res) => {
  try {
    const spots = await TouristSpot.find().sort({ likes: -1 }).limit(5).select('name likes');

    res.json({
      success: true,
      popularSpots: spots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
