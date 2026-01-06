import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import Location from '../models/Location.js';

const router = express.Router();

/* ================== HELPERS ================== */
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/* ================== REGISTER ================== */
router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password,
        gender,
        age,
        dateOfBirth,
        homeLocation,
        interests,
        budgetPreference,
        crowdPreference,
        travelStyle,
        emergencyContact,
        medicalNotes,
      } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({
        name,
        email,
        password, // hashed in model
        gender,
        age,
        dateOfBirth,
        homeLocation,
        interests,
        budgetPreference,
        crowdPreference,
        travelStyle,
        emergencyContact,
        medicalNotes,
        role: 'user', // 🔐 HARD LOCK
      });

      await user.save();

      const token = generateToken(user);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

/* ================== LOGIN ================== */
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

/* ================== LOGOUT ================== */
/* JWT is stateless – frontend deletes token */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

/* ================== CURRENT USER ================== */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================== ADMIN ROUTES ================== */
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

/* ================== GET ALL USERS (ADMIN) ================== */
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ isActive: { $ne: false } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================== SOFT DELETE USER ================== */
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================== PROMOTE TO ADMIN (SUPERADMIN ONLY) ================== */
router.put('/users/:id/make-admin', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin allowed' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true });

    res.json({ message: 'User promoted to admin', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================== ADMIN PROFILE ================== */
router.get('/admin/me', verifyToken, async (req, res) => {
  try {
    const admin = await User.findById(req.userId).select('-password');
    if (!admin || !['admin', 'superadmin'].includes(admin.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================== PUBLIC LOCATIONS ================== */
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
