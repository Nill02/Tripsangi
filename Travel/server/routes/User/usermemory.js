import express from 'express';
import User from '../../models/UserModel.js';
import { auth as protect } from '../../middleware/auth.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import upload from '../../middleware/uploadMiddleware.js'; // multer + cloudinary
import Memory from '../../models/Memory.js';

const router = express.Router();

/* -------------------- REGISTER USER -------------------- */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* -------------------- LOGIN USER -------------------- */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* -------------------- GET USER PROFILE -------------------- */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* -------------------- UPLOAD PROFILE PHOTO -------------------- */
router.put('/upload-profile-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePhoto = req.file.path;
    await user.save();

    res.json({ message: 'Profile photo uploaded', profilePhoto: user.profilePhoto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

/* -------------------- MEMORY SHARING -------------------- */

// Create a new memory (text + optional image) for a place
router.post('/memory', protect, upload.single('image'), async (req, res) => {
  try {
    const { placeId, text } = req.body;

    if (!placeId || !text)
      return res.status(400).json({ message: 'Place ID and text are required' });

    const memory = await Memory.create({
      user: req.user.id,
      placeId,
      text,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json({ message: 'Memory shared successfully', memory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to share memory' });
  }
});
// GET memories by a specific user (optionally filter by place)
router.get('/memories/user/:personId', protect, async (req, res) => {
  try {
    const { personId } = req.params;
    const { placeId } = req.query; // optional query to filter by place

    // Build query dynamically
    const query = { user: personId };
    if (placeId) query.placeId = placeId;

    const memories = await Memory.find(query)
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.json(memories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch memories' });
  }
});

// Get all memories for a specific place
router.get('/memories/:placeId', protect, async (req, res) => {
  try {
    const { placeId } = req.params;

    const memories = await Memory.find({ placeId }).populate('user', 'name profilePhoto');
    res.json(memories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch memories' });
  }
});

// Delete memory (only owner)
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
