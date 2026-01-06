import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }], // multiple images
    googleMapsLink: { type: String, required: true },
    touristSpots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TouristSpot' }], // reference to tourist spots
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }], // optional: hotels in this location
    transports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transport' }], // optional: transport in this location
  },
  { timestamps: true },
);

export default mongoose.model('Location', locationSchema);
