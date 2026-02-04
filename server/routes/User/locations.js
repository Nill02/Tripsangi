import express from 'express';
import mongoose from 'mongoose';

import Location from '../../models/Location.js';
import TouristSpot from '../../models/TouristSpot.js';
import Hotel from '../../models/hotel.js';
import Transport from '../../models/transport.js';

const router = express.Router();

/* =====================================================
   Helpers
===================================================== */

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const serverError = (res, error) => {
  console.error('❌ Server Error:', error.message);
  return res.status(500).json({ message: 'Server error' });
};

/* =====================================================
   GET ALL LOCATIONS (Search Supported)
   GET /api/locations?search=
===================================================== */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const locations = await Location.find(query)
      .select('name city country images googleMapsLink')
      .sort({ name: 1 })
      .lean()
      .then((locs) =>
        locs.map((loc) => ({
          ...loc,
          image: loc.images?.[0] || 'https://via.placeholder.com/400x300',
        })),
      );

    res.status(200).json(locations);
  } catch (error) {
    serverError(res, error);
  }
});

/* =====================================================
   GET SINGLE LOCATION (FULL DETAILS)
   GET /api/locations/:id
===================================================== */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid location ID' });
  }

  try {
    const location = await Location.findById(id)
      .populate('touristSpots', 'name image')
      .populate('hotels', 'name price rating image')
      .populate('transports', 'name type price')
      .lean();

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({
      ...location,
      image: location.images?.[0] || 'https://via.placeholder.com/400x300',
      touristSpots: location.touristSpots || [],
      hotels: location.hotels || [],
      transports: location.transports || [],
    });
  } catch (error) {
    serverError(res, error);
  }
});

/* =====================================================
   GET TOURIST SPOTS BY LOCATION
   GET /api/locations/:id/tourist-spots
===================================================== */
router.get('/:id/tourist-spots', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid location ID' });
  }

  try {
    const spots = await TouristSpot.find({ location: id })
      .select('name images')
      .populate('location', 'name city country')
      .sort({ name: 1 })
      .lean()
      .then((data) =>
        data.map((spot) => ({
          ...spot,
          image: spot.images?.[0] || 'https://via.placeholder.com/400x300',
        })),
      );

    res.status(200).json(spots);
  } catch (error) {
    serverError(res, error);
  }
});

/* =====================================================
   GET HOTELS BY LOCATION
   GET /api/locations/:id/hotels
===================================================== */
router.get('/:id/hotels', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid location ID' });
  }

  try {
    const hotels = await Hotel.find({ location: id })
      .select('name price rating image')
      .sort({ price: 1 });

    res.status(200).json(hotels);
  } catch (error) {
    serverError(res, error);
  }
});

/* =====================================================
   GET TRANSPORTS BY LOCATION
   GET /api/locations/:id/transports
===================================================== */
router.get('/:id/transports', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid location ID' });
  }

  try {
    const transports = await Transport.find({ location: id })
      .select('name type price')
      .sort({ price: 1 });

    res.status(200).json(transports);
  } catch (error) {
    serverError(res, error);
  }
});

export default router;
