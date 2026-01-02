import express from 'express';
import HotelOrder from '../../models/Order/HotelOrder.js';
import Hotel from '../../models/hotel.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/* -------------------- CREATE ORDER -------------------- */
router.post('/', protect, async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, guests } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const days = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    const totalPrice = days * hotel.price;

    const order = await HotelOrder.create({
      user: req.user.id,
      hotel: hotelId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Order creation failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET USER'S HOTEL ORDERS -------------------- */
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await HotelOrder.find({ user: req.user.id })
      .populate('hotel', 'name location price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- REQUEST CANCELLATION -------------------- */
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await HotelOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.cancellationRequested = true;
    await order.save();

    res.json({ message: 'Cancellation request sent. Waiting for approval.' });
  } catch (error) {
    console.error('❌ Failed to request cancellation:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
