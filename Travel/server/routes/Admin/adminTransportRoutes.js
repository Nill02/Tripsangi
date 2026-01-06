import express from 'express';
import { auth, verifyAdmin } from '../../middleware/auth.js';
import Transport from '../../models/transport.js';
import Location from '../../models/Location.js';

const router = express.Router();

/* -------------------- GET ALL TRANSPORTS -------------------- */
router.get('/', auth, verifyAdmin, async (req, res) => {
  try {
    const { type, locationId, availability } = req.query;
    const query = {};

    if (type) query.type = type;
    if (locationId) query.location = locationId;
    if (availability) query.availability = availability === 'true';

    const transports = await Transport.find(query).populate('location', 'name country');
    res.status(200).json(transports);
  } catch (error) {
    console.error('❌ Error fetching transports:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- CREATE TRANSPORT -------------------- */
router.post('/', auth, verifyAdmin, async (req, res) => {
  try {
    const newTransport = new Transport(req.body);
    const savedTransport = await newTransport.save();

    // Optionally, add transport reference to location
    if (req.body.location) {
      await Location.findByIdAndUpdate(req.body.location, {
        $push: { transports: savedTransport._id },
      });
    }

    res.status(201).json(savedTransport);
  } catch (error) {
    console.error('❌ Error creating transport:', error.message);
    res.status(500).json({ message: 'Error creating transport', error });
  }
});

/* -------------------- UPDATE TRANSPORT -------------------- */
router.put('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const updatedTransport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedTransport);
  } catch (error) {
    console.error('❌ Error updating transport:', error.message);
    res.status(500).json({ message: 'Error updating transport', error });
  }
});

/* -------------------- DELETE TRANSPORT -------------------- */
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) return res.status(404).json({ message: 'Transport not found' });

    // Optionally remove reference from location
    if (transport.location) {
      await Location.findByIdAndUpdate(transport.location, {
        $pull: { transports: transport._id },
      });
    }

    await Transport.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transport deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting transport:', error.message);
    res.status(500).json({ message: 'Error deleting transport', error });
  }
});

export default router;
