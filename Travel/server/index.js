import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import adminRoutes from './routes/Admin/adminRoutes.js';
import authRoutes from './routes/auth.js';
import locationRoutes from './routes/User/locations.js';
import touristSpotRoutes from './routes/User/touristSpots.js';
import hotelRoutes from './routes/User/hotels.js';
import transportRoutes from './routes/User/transport.js';
import usermwmoryRoutes from './routes/User/usermemory.js';
import aiRoutePlanningRoutes from './routes/User/aiRoutePlanning.js';
import superAdmin from './routes/superAdminRoutes.js';
import hotelOrderRoutes from './routes/Order/HotelOrder.js';
import transportOrderRoutes from './routes/Order/TransportOrder.js';
import agencyOrderRoutes from './routes/Order/AgencyOrder.js';
import allOrdersRoutes from './routes/Order/allOrdersRoutes.js.js';
import connectDB from './utils/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// =====================
// 🌐 Middleware
// =====================
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// =====================
// 🗄️ Database
// =====================
connectDB();

// =====================
// 🚀 Routes
// =====================
app.use('/api/admlocationsin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/tourist-spots', touristSpotRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/usermemory', usermwmoryRoutes);
app.use('/api/superadmin', superAdmin);
// 🤖 AI Route Planning
app.use('/api/ai', aiRoutePlanningRoutes);
// 📦 Orders
app.use('/api/orders/hotels', hotelOrderRoutes);
app.use('/api/orders/transports', transportOrderRoutes);
app.use('/api/orders/agencies', agencyOrderRoutes);
app.use('/api/orders', allOrdersRoutes);

// =====================
// ❌ Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// =====================
// 🟢 Server
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
