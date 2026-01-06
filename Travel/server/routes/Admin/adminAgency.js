import express from 'express';
import {
  createTourist,
  getAllTourists,
  updateTourist,
  deleteTourist,
} from '../../controllers/agencyController.js';

import { auth, verifyAdmin, verifySuperAdmin } from '../../middleware/auth.js';

const router = express.Router();

/* ===============================
   👀 VIEW (Admin & Super Admin)
================================ */
router.get('/', auth, verifyAdmin, getAllTourists);

/* ===============================
   ➕ CREATE (Admin & Super Admin)
================================ */
router.post('/', auth, verifyAdmin, createTourist);

/* ===============================
   ✏️ UPDATE (Admin & Super Admin)
================================ */
router.put('/:id', auth, verifyAdmin, updateTourist);

/* ===============================
   ❌ DELETE (SUPER ADMIN ONLY)
================================ */
router.delete('/:id', auth, verifySuperAdmin, deleteTourist);

export default router;
