import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const memorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: String, required: true }, // ID of tourist place
    text: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked
    comments: [commentSchema],
  },
  { timestamps: true },
);

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
