import express from 'express';
import { auth, verifyAdmin } from '../../middleware/auth.js';
import Location from '../../models/Location.js';
import TouristSpot from '../../models/TouristSpot.js';
import Hotel from '../../models/hotel.js';
import Transport from '../../models/transport.js';

const router = express.Router();

/* -------------------- GET ALL LOCATIONS -------------------- */
router.get('/', auth, verifyAdmin, async (req, res) => {
  try {
    const locations = await Location.find()
      .populate('touristSpots', 'name') // populate only name for dashboard
      .populate('hotels', 'name')
      .populate('transports', 'name type');

    res.status(200).json(locations);
  } catch (error) {
    console.error('❌ Error fetching locations:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- CREATE LOCATION -------------------- */
router.post('/', auth, verifyAdmin, async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error('❌ Error creating location:', error.message);
    res.status(500).json({ message: 'Error creating location', error });
  }
});

/* -------------------- UPDATE LOCATION -------------------- */
router.put('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error('❌ Error updating location:', error.message);
    res.status(500).json({ message: 'Error updating location', error });
  }
});

/* -------------------- DELETE LOCATION -------------------- */
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    // Optional: Remove references in TouristSpots, Hotels, and Transports
    await TouristSpot.updateMany(
      { _id: { $in: location.touristSpots } },
      { $unset: { location: '' } },
    );
    await Hotel.updateMany({ _id: { $in: location.hotels } }, { $unset: { location: '' } });
    await Transport.updateMany({ _id: { $in: location.transports } }, { $unset: { location: '' } });

    await Location.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting location:', error.message);
    res.status(500).json({ message: 'Error deleting location', error });
  }
});

export default router;
