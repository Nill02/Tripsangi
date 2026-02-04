import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3️⃣ Generate JWT token (🔥 FIXED)
    const token = jwt.sign(
      {
        userId: user._id, // ✅ MUST MATCH middleware
        role: user.role, // ✅ REQUIRED for verifyAdmin
      },
      process.env.JWT_SECRET, // ✅ ENV based secret
      { expiresIn: '7d' }, // ✅ Better for admin panel
    );

    // 4️⃣ Send safe response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
