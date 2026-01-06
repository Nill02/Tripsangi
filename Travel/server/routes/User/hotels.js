import express from 'express';
import Hotel from '../../models/hotel.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/* -------------------- GET HOTELS BY LOCATION -------------------- */
router.get('/location/:location', async (req, res) => {
  try {
    const location = req.params.location;

    const hotels = await Hotel.find({
      location: { $regex: location, $options: 'i' }, // case-insensitive
    }).sort({ createdAt: -1 });

    res.json(hotels);
  } catch (error) {
    console.error('❌ Error fetching hotels by location:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

  hotel.comments.push({ user: req.user.id, text });
  await hotel.save();
  res.json(hotel.comments);
});
router.put('/:id/like', protect, async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

  const userId = req.user.id;
  if (hotel.likes.includes(userId)) {
    hotel.likes = hotel.likes.filter((id) => id.toString() !== userId);
  } else {
    hotel.likes.push(userId);
  }
  await hotel.save();
  res.json({ likes: hotel.likes.length });
});

/* -------------------- GET HOTEL BY ID -------------------- */
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    res.json(hotel);
  } catch (error) {
    console.error('❌ Error fetching hotel:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- REQUEST CANCELLATION -------------------- */
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // Mark as cancellation requested
    hotel.cancellationRequested = true;
    await hotel.save();

    res.json({ message: 'Cancellation request sent. Waiting for approval.' });
  } catch (error) {
    console.error('❌ Failed to request cancellation:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
