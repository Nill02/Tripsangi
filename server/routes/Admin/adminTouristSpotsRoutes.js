import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import TouristSpot from '../../models/TouristSpot.js';
import { auth, verifyAdmin, optionalAuth } from '../../middleware/auth.js';

const router = express.Router();

// ==============================
// 1️⃣ Get All Tourist Spots (Optional Location Filter)
// ==============================
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};

    const spots = await TouristSpot.find(query).populate('location', 'name country');
    res.status(200).json(spots);
  } catch (error) {
    console.error('❌ Error fetching tourist spots:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// 2️⃣ Get a Specific Tourist Spot by ID
// ==============================
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tourist spot ID' });
    }

    const spot = await TouristSpot.findById(id).populate('location', 'name country');
    if (!spot) return res.status(404).json({ message: 'Tourist spot not found' });

    res.status(200).json(spot);
  } catch (error) {
    console.error('❌ Error fetching tourist spot:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// 3️⃣ Add a New Tourist Spot (Admin Only)
// ==============================
router.post(
  '/',
  auth,
  verifyAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('images').isArray({ min: 1 }).withMessage('At least one image URL is required'),
    body('googleMapLink').trim().notEmpty().withMessage('Google Maps location is required'),
    body('bestTime').optional().trim(),
    body('entryFee').optional().trim(),
    body('duration').optional().trim(),
    body('price').optional().trim(),
    body('category').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, googleMapLink, ...data } = req.body;

    if (!mongoose.Types.ObjectId.isValid(location)) {
      return res.status(400).json({ message: 'Invalid location ID' });
    }

    try {
      const spot = new TouristSpot({
        ...data,
        location,
        coordinates: googleMapLink, // store Google Maps link/text
      });

      await spot.save();

      const populatedSpot = await TouristSpot.findById(spot._id).populate(
        'location',
        'name country',
      );
      res.status(201).json(populatedSpot);
    } catch (error) {
      console.error('❌ Error creating tourist spot:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
);

// ==============================
// 4️⃣ Update a Tourist Spot (Admin Only)
// ==============================
router.put('/:id', auth, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid tourist spot ID' });
  }

  try {
    const updatedTouristSpot = await TouristSpot.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTouristSpot) return res.status(404).json({ message: 'TouristSpot not found' });

    res.status(200).json(updatedTouristSpot);
  } catch (error) {
    console.error('❌ Error updating tourist spot:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==============================
// 5️⃣ Delete a Tourist Spot (Admin Only)
// ==============================
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid tourist spot ID' });
  }

  try {
    const deletedSpot = await TouristSpot.findByIdAndDelete(id);
    if (!deletedSpot) return res.status(404).json({ message: 'Tourist spot not found' });

    res.status(200).json({ message: 'Tourist spot deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting tourist spot:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
