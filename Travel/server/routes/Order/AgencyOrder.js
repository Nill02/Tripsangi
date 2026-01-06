import express from 'express';
import AdminAgencyRequest from '../../models/Order/Agency.js';
import AdminAgency from '../../models/Agency.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/* -------------------- CREATE REQUEST -------------------- */
router.post('/', protect, async (req, res) => {
  try {
    const { agencyId, serviceType, description, serviceDate, budget } = req.body;

    const agency = await AdminAgency.findById(agencyId);
    if (!agency || !agency.isActive) {
      return res.status(404).json({ message: 'Agency not available' });
    }

    const request = await AdminAgencyRequest.create({
      user: req.user.id,
      agency: agencyId,
      serviceType,
      description,
      serviceDate,
      budget,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('❌ Agency request failed:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
/* -------------------- GET USER'S AGENCY REQUESTS -------------------- */

router.get('/my', protect, async (req, res) => {
  const requests = await AdminAgencyRequest.find({ user: req.user.id })
    .populate('agency', 'name owner serviceArea contact')
    .sort({ createdAt: -1 });

  res.json(requests);
});
/* -------------------- CANCEL AGENCY REQUEST -------------------- */
router.post('/:id/cancel', protect, async (req, res) => {
  const request = await AdminAgencyRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (request.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  request.cancellationRequested = true;
  await request.save();

  res.json({ message: 'Cancellation request sent' });
});

export default router;
