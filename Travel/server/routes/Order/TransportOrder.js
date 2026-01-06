import express from 'express';
import TransportOrder from '../../models/Order/TransportOrder.js';
import Transport from '../../models/transport.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/* -------------------- CREATE TRANSPORT ORDER -------------------- */
router.post('/', protect, async (req, res) => {
  try {
    const { transportId, travelDate, passengers } = req.body;

    const transport = await Transport.findById(transportId);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    if (!transport.availability || transport.seats < passengers) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const totalPrice = passengers * transport.price;

    const order = await TransportOrder.create({
      user: req.user.id,
      transport: transportId,
      travelDate,
      passengers,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Transport order failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET USER'S TRANSPORT ORDERS -------------------- */

router.get('/my', protect, async (req, res) => {
  const orders = await TransportOrder.find({ user: req.user.id })
    .populate('transport', 'name type from to price images duration')
    .sort({ createdAt: -1 });

  res.json(orders);
});
/* -------------------- CANCEL TRANSPORT ORDER -------------------- */

router.post('/:id/cancel', protect, async (req, res) => {
  const order = await TransportOrder.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  order.cancellationRequested = true;
  await order.save();

  res.json({ message: 'Cancellation request sent' });
});

export default router;
