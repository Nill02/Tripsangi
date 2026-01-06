import express from 'express';
import { auth, verifyAdmin, verifySuperAdmin } from '../../middleware/auth.js';

import { checkPermission } from '../../middleware/checkPermission.js';


import adminHotelsRoutes from './adminHotelsRoutes.js';
import adminTransportRoutes from './adminTransportRoutes.js';
import adminTouristSpotsRoutes from './adminTouristSpotsRoutes.js';
import adminLocation from './adminLocation.js';
import adminStatsRoutes from './adminStatsRoutes.js';
import adminAgency from './adminAgency.js';

const router = express.Router();

// 🔐 AUTH REQUIRED FOR ALL ADMIN ROUTES
router.use(auth);

// 📊 Admin Stats
router.use('/stats', checkPermission('stats'), adminStatsRoutes);

// 🏨 Hotels
router.use('/hotels', checkPermission('hotels'), adminHotelsRoutes);

// 🚕 Transport
router.use('/transport', checkPermission('transport'), adminTransportRoutes);

// 🗺️ Tourist Spots
router.use('/tourist-spots', checkPermission('touristSpots'), adminTouristSpotsRoutes);

// 📍 Locations
router.use('/locations', checkPermission('locations'), adminLocation);

// 🏢 Agency
router.use('/agency', checkPermission('agency'), adminAgency);

export default router;
