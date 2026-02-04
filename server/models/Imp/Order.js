import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['hotel', 'transport', 'agency'],
      required: true,
    },

    // Dynamic reference
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'typeRef',
    },

    typeRef: {
      type: String,
      enum: ['Hotel', 'Transport', 'AdminAgency'],
      required: true,
    },

    details: {
      type: Object, // dates, passengers, service info
      default: {},
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },

    cancellationRequested: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
