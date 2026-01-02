import mongoose from 'mongoose';

const validTypes = ['bus', 'train', '4wheeler', 'toto', 'taxi', 'bike', 'flight', 'ship', 'boat'];

const TransportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: validTypes,
        message: 'Invalid transport type',
      },
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [{ type: String }], // optional transport images
    from: { type: String, required: true }, // source location
    to: { type: String, required: true }, // destination location
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    availability: {
      type: Boolean,
      default: true,
    },
    stopage: {
      type: [String],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    seats: { type: Number, default: 0 }, // available seats
  },
  { timestamps: true }, // adds createdAt & updatedAt
);

export default mongoose.model('Transport', TransportSchema);
