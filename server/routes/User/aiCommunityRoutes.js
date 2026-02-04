import express from 'express';
import { protect } from '../middleware/auth.js';
import { communityIntelligenceEngine } from '../ai/communityIntelligenceEngine.js';

const router = express.Router();

/**
 * POST /api/ai/community-insights
 */
router.post('/community-insights', protect, async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required',
      });
    }

    const aiResult = await communityIntelligenceEngine({
      userId: req.user._id,
      location,
    });

    res.status(200).json(aiResult);
  } catch (error) {
    console.error('Community AI Error:', error);
    res.status(500).json({
      success: false,
      message: 'Community AI failed',
    });
  }
});

export default router;
