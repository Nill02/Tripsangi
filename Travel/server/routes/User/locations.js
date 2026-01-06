import express from 'express';
import mongoose from 'mongoose';
import Location from '../../models/Location.js';
import TouristSpot from '../../models/TouristSpot.js';
import Hotel from '../../models/hotel.js';
import Transport from '../../models/transport.js';

const router = express.Router();

/* -------------------- GET ALL LOCATIONS (Search Supported) -------------------- */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const locations = await Location.find(query).select('name country city image googleMapsLink');

    res.status(200).json(locations);
  } catch (error) {
    console.error('❌ Error fetching locations:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET SINGLE LOCATION (FULL DETAILS) -------------------- */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid location ID' });
  }

  try {
    const location = await Location.findById(id)
      .populate('touristSpots', 'name image')
      .populate('hotels', 'name price rating image')
      .populate('transports', 'name type price');

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error('❌ Error fetching location:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET TOURIST SPOTS FOR A LOCATION -------------------- */
router.get('/:id/tourist-spots', async (req, res) => {
  try {
    const spots = await TouristSpot.find({ location: req.params.id }).select(
      'name image coordinates',
    );

    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET HOTELS FOR A LOCATION -------------------- */
router.get('/:id/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({ location: req.params.id }).select('name price rating image');

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET TRANSPORTS FOR A LOCATION -------------------- */
router.get('/:id/transports', async (req, res) => {
  try {
    const transports = await Transport.find({ location: req.params.id }).select('name type price');

    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
