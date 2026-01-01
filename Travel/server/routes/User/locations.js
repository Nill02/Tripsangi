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

    const locations = await Location.find(query).select(
      'name country city description images googleMapsLink touristSpots hotels transports',
    );

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error('❌ Error fetching locations:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* -------------------- GET SINGLE LOCATION (FULL DETAILS) -------------------- */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid location ID',
    });
  }

  try {
    const location = await Location.findById(id)
      .populate('touristSpots', 'name images')
      .populate('hotels', 'name price rating images')
      .populate('transports', 'name type price');

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error('❌ Error fetching location:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* -------------------- GET TOURIST SPOTS FOR A LOCATION -------------------- */
router.get('/:id/tourist-spots', async (req, res) => {
  try {
    const spots = await TouristSpot.find({ location: req.params.id }).select(
      'name images coordinates',
    );

    res.status(200).json({
      success: true,
      data: spots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* -------------------- GET HOTELS FOR A LOCATION -------------------- */
router.get('/:id/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({ location: req.params.id }).select('name price rating images');

    res.status(200).json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* -------------------- GET TRANSPORTS FOR A LOCATION -------------------- */
router.get('/:id/transports', async (req, res) => {
  try {
    const transports = await Transport.find({ location: req.params.id }).select('name type price');

    res.status(200).json({
      success: true,
      data: transports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;
