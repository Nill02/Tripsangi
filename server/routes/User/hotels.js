import express from 'express';
import Hotel from '../../models/hotel.js';
import { auth,protect,verifyAdmin } from '../../middleware/auth.js';

const router = express.Router();




/* -------------------- GET ALL HOTELS -------------------- */
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

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
/* -------------------- UPDATE ROOM AVAILABILITY -------------------- */
router.patch(
  '/:hotelId/rooms/:roomId/availability',
  auth,
  verifyAdmin,
  async (req, res) => {
    try {
      const { availableRooms } = req.body;

      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

      const room = hotel.rooms.id(req.params.roomId);
      if (!room) return res.status(404).json({ message: 'Room not found' });

      room.availableRooms = availableRooms;
      await hotel.save();

      res.status(200).json({
        message: 'Room availability updated',
        availableRooms: room.availableRooms,
      });
    } catch (error) {
      console.error('❌ Error updating availability:', error.message);
      res.status(500).json({ message: 'Error updating availability', error });
    }
  }
);
/* -------------------- UPDATE ROOM -------------------- */
router.put('/:hotelId/rooms/:roomId', auth, verifyAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const room = hotel.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    Object.assign(room, req.body);
    await hotel.save();

    res.status(200).json({
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    console.error('❌ Error updating room:', error.message);
    res.status(500).json({ message: 'Error updating room', error });
  }
});
/* -------------------- ADD ROOM TO HOTEL -------------------- */
router.post('/:hotelId/rooms', auth, verifyAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    hotel.rooms.push(req.body); // room object
    await hotel.save();

    res.status(201).json({
      message: 'Room added successfully',
      rooms: hotel.rooms,
    });
  } catch (error) {
    console.error('❌ Error adding room:', error.message);
    res.status(500).json({ message: 'Error adding room', error });
  }
});

/* -------------------- DELETE ROOM -------------------- */
router.delete('/:hotelId/rooms/:roomId', auth, verifyAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const room = hotel.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.deleteOne();
    await hotel.save();

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting room:', error.message);
    res.status(500).json({ message: 'Error deleting room', error });
  }
});


export default router;
