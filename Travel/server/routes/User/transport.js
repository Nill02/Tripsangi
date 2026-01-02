import express from 'express';
import Transport from '../../models/transport.js';
import { protect } from '../../middleware/auth.js'; // optional auth if needed

const router = express.Router();

/* -------------------- GET ALL TRANSPORTS -------------------- */
router.get('/', async (req, res) => {
  try {
    const { type, from, to, available } = req.query;

    // Build dynamic query
    const query = {};
    if (type) query.type = type;
    if (from) query.from = from;
    if (to) query.to = to;
    if (available) query.availability = available === 'true';

    const transports = await Transport.find(query).sort({ createdAt: -1 });
    res.json(transports);
  } catch (err) {
    console.error('❌ Failed to fetch transports:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- GET TRANSPORT BY ID -------------------- */
router.get('/:id', async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.json(transport);
  } catch (error) {
    console.error('❌ Error fetching transport:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- REQUEST CANCELLATION -------------------- */
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) return res.status(404).json({ message: 'Transport not found' });

    // Instead of deleting, mark as cancellation requested
    transport.cancellationRequested = true;
    await transport.save();

    res.json({ message: 'Cancellation request sent. Waiting for approval.' });
  } catch (error) {
    console.error('❌ Failed to request cancellation:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
