import mongoose from 'mongoose';

const adminAgencyRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminAgency',
      required: true,
    },

    serviceType: {
      type: String,
      required: true, // example: tour-guide, transport, hotel-support
    },

    description: {
      type: String,
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    budget: {
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

export default mongoose.model('AdminAgencyRequest', adminAgencyRequestSchema);
