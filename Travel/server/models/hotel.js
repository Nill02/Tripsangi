import mongoose from 'mongoose';

// Comment sub-schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String, // Google Maps location as plain text
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [{ type: String }], // multiple hotel photos
    bestTime: String,
    entryFee: String,
    duration: String,
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    cancellationRequested: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('Hotel', hotelSchema);
