import mongoose from 'mongoose';

const transportOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transport',
      required: true,
    },

    travelDate: {
      type: Date,
      required: true,
    },

    passengers: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
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

export default mongoose.model('TransportOrder', transportOrderSchema);
