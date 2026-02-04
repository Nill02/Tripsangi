import express from 'express';
import { protect } from '../../middleware/auth.js';

import HotelOrder from '../../models/Order/HotelOrder.js';
import TransportOrder from '../../models/Order/TransportOrder.js';
import AdminAgencyRequest from '../../models/Order/Agency.js';
import AdminAgency from '../../models/Agency.js';

const router = express.Router();

/* =====================================================
   SUPER ADMIN GUARD
===================================================== */
const superAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super Admin access only' });
  }
  next();
};

/* =====================================================
   COMMISSION CONFIG (can be moved to DB later)
===================================================== */

let COMMISSION_PERCENT = 5; // default 5%

/* =====================================================
   UPDATE COMMISSION (SUPER ADMIN)
===================================================== */
router.put('/commission', protect, superAdmin, async (req, res) => {
  const { percent } = req.body;

  if (percent < 0 || percent > 100) {
    return res.status(400).json({ message: 'Invalid commission value' });
  }

  COMMISSION_PERCENT = percent;

  res.json({
    message: 'Commission updated successfully',
    commissionPercent: COMMISSION_PERCENT,
  });
});

/* =====================================================
   GET ALL ORDERS + COMMISSION CALCULATION
===================================================== */
router.get('/', protect, superAdmin, async (req, res) => {
  try {
    const { type = 'all' } = req.query;

    let hotelOrders = [];
    let transportOrders = [];
    let agencyRequests = [];

    if (type === 'hotel' || type === 'all') {
      hotelOrders = await HotelOrder.find()
        .populate('user', 'name email')
        .populate('hotel', 'name location price');
    }

    if (type === 'transport' || type === 'all') {
      transportOrders = await TransportOrder.find()
        .populate('user', 'name email')
        .populate('transport', 'name type from to price');
    }

    if (type === 'agency' || type === 'all') {
      agencyRequests = await AdminAgencyRequest.find()
        .populate('user', 'name email')
        .populate('agency', 'name serviceArea');
    }

    /* ================= PAYMENT CALC ================= */

    const approvedHotelOrders = hotelOrders.filter((o) => o.status === 'approved');
    const approvedTransportOrders = transportOrders.filter((o) => o.status === 'approved');

    const hotelTotal = approvedHotelOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const transportTotal = approvedTransportOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const grossTotal = hotelTotal + transportTotal;

    const commissionAmount = (grossTotal * COMMISSION_PERCENT) / 100;

    const netPayable = grossTotal - commissionAmount;

    res.json({
      commission: {
        percent: COMMISSION_PERCENT,
        amount: commissionAmount,
      },
      totals: {
        hotelTotal,
        transportTotal,
        grossTotal,
        netPayable,
      },
      counts: {
        hotelOrders: hotelOrders.length,
        transportOrders: transportOrders.length,
        agencyRequests: agencyRequests.length,
      },
      data: {
        hotels: hotelOrders,
        transports: transportOrders,
        agencies: agencyRequests,
      },
    });
  } catch (error) {
    console.error('❌ All orders fetch failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
