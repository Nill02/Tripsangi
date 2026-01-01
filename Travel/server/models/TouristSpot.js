import mongoose from 'mongoose';

// Comment sub-schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const touristSpotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true }, // Google Maps location as plain text
    description: { type: String, required: true },
    images: [{ type: String }], // array of images
    bestTime: { type: String },
    entryFee: { type: String },
    duration: { type: String },
    price: { type: String },
    memories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memory' }], // reference to Memory
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('TouristSpot', touristSpotSchema);
