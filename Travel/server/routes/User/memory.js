import express from 'express';
import Memory from '../models/MemoryModel.js';
import { protect } from '../Midileware/authMiddleware.js';
import upload from '../Midileware/uploadMiddleware.js';

const router = express.Router();

/* -------------------- CREATE MEMORY -------------------- */
// Upload up to 5 images
router.post(
  '/memory',
  protect,
  upload.array('images', 5), // max 5 files
  async (req, res) => {
    try {
      const { placeId, text } = req.body;

      if (!placeId || !text) {
        return res.status(400).json({ message: 'Place ID and text are required' });
      }

      const images = req.files ? req.files.map((file) => file.path) : [];

      const memory = await Memory.create({
        user: req.user.id,
        placeId,
        text,
        images,
      });

      res.status(201).json({ message: 'Memory shared successfully', memory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to share memory' });
    }
  },
);

/* -------------------- GET MEMORIES FOR A PLACE -------------------- */
router.get('/memories/:placeId', protect, async (req, res) => {
  try {
    const { placeId } = req.params;

    const memories = await Memory.find({ placeId })
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.json(memories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch memories' });
  }
});

/* -------------------- DELETE MEMORY -------------------- */
router.delete('/memory/:id', protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    if (memory.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await memory.remove();
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete memory' });
  }
});

export default router;
