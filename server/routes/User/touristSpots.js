import express from 'express';
import { body, validationResult } from 'express-validator';
import TouristSpot from '../../models/TouristSpot.js';
import Location from '../../models/Location.js';
import { auth, optionalAuth } from '../../middleware/auth.js';

const router = express.Router();

/* -------------------- GET ALL SPOTS (with optional location & pagination) -------------------- */
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 20 } = req.query;

    const query = {};

    if (location) {
      // If client passed an ObjectId, use it directly; otherwise try to find by location name
      const isObjectId = mongoose.Types.ObjectId.isValid(location);
      if (isObjectId) {
        query.location = location;
      } else {
        const locDoc = await Location.findOne({ name: { $regex: `^${location}$`, $options: 'i' } });
        if (locDoc) query.location = locDoc._id;
        else query.location = null; // will return empty
      }
    }

    const spots = await TouristSpot.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('location', 'name country');

    const total = await TouristSpot.countDocuments(query);

    res.json({ spots, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Error fetching tourist spots:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET SPOT BY ID -------------------- */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const spot = await TouristSpot.findById(req.params.id)
      .populate('location', 'name country')
      .populate('comments.user', 'name profilePhoto');

    if (!spot) return res.status(404).json({ message: 'Tourist spot not found' });

    res.json(spot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- CREATE NEW SPOT (ADMIN ONLY) -------------------- */
router.post(
  '/',
  auth, // Only admin should have access
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('images').isArray().withMessage('Images must be an array of URLs'),
    body('bestTime').optional().trim(),
    body('entryFee').optional().trim(),
    body('duration').optional().trim(),
    body('coordinates').optional().isObject(),
    body('category').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const spot = new TouristSpot(req.body);
      await spot.save();

      const populatedSpot = await TouristSpot.findById(spot._id).populate(
        'location',
        'name country',
      );

      res.status(201).json(populatedSpot);
    } catch (error) {
      console.error('Error creating tourist spot:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

/* -------------------- LIKE / UNLIKE SPOT -------------------- */
router.put('/:id/like', auth, async (req, res) => {
  try {
    const spot = await TouristSpot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Tourist spot not found' });

    const userId = req.user.id;
    if (spot.likes.includes(userId)) {
      spot.likes = spot.likes.filter((id) => id.toString() !== userId);
    } else {
      spot.likes.push(userId);
    }

    await spot.save();
    res.json({ likesCount: spot.likes.length, likes: spot.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like/unlike spot' });
  }
});

/* -------------------- ADD COMMENT -------------------- */
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const spot = await TouristSpot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Tourist spot not found' });

    const comment = { user: req.user.id, text };
    spot.comments.push(comment);
    await spot.save();

    // Populate user for frontend
    const updatedSpot = await TouristSpot.findById(spot._id).populate(
      'comments.user',
      'name profilePhoto',
    );
    res.json(updatedSpot.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

/* -------------------- DELETE COMMENT -------------------- */
router.delete('/:spotId/comment/:commentId', auth, async (req, res) => {
  try {
    const { spotId, commentId } = req.params;

    const spot = await TouristSpot.findById(spotId);
    if (!spot) return res.status(404).json({ message: 'Tourist spot not found' });

    const comment = spot.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.remove();
    await spot.save();

    const updatedSpot = await TouristSpot.findById(spotId).populate(
      'comments.user',
      'name profilePhoto',
    );
    res.json(updatedSpot.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;
