import express from 'express';
import { auth, verifyAdmin } from '../../middleware/auth.js';
import Hotel from '../../models/hotel.js';
import Location from '../../models/Location.js';

const router = express.Router();

/* -------------------- GET ALL HOTELS -------------------- */
router.get('/', auth, verifyAdmin, async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};

    const hotels = await Hotel.find(query).populate('location', 'name country');
    res.status(200).json(hotels);
  } catch (error) {
    console.error('❌ Error fetching hotels:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- CREATE HOTEL -------------------- */
router.post('/', auth, verifyAdmin, async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();

    // Add hotel reference to location
    if (req.body.location) {
      await Location.findByIdAndUpdate(req.body.location, {
        $push: { hotels: savedHotel._id },
      });
    }

    res.status(201).json(savedHotel);
  } catch (error) {
    console.error('❌ Error creating hotel:', error.message);
    res.status(500).json({ message: 'Error creating hotel', error });
  }
});

/* -------------------- UPDATE HOTEL -------------------- */
router.put('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error('❌ Error updating hotel:', error.message);
    res.status(500).json({ message: 'Error updating hotel', error });
  }
});

/* -------------------- DELETE HOTEL -------------------- */
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // Remove hotel reference from location
    if (hotel.location) {
      await Location.findByIdAndUpdate(hotel.location, {
        $pull: { hotels: hotel._id },
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting hotel:', error.message);
    res.status(500).json({ message: 'Error deleting hotel', error });
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


export default router;
