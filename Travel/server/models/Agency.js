import mongoose from 'mongoose';

const adminAgencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: String,
      required: true,
      trim: true,
    },

    serviceArea: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        lowercase: true,
      },
    },

    // ⭐ Rating System
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalStars: {
        type: Number,
        default: 0,
      },
      totalUsers: {
        type: Number,
        default: 0,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // admin who created it
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Safe model export
export default mongoose.models.AdminAgency || mongoose.model('AdminAgency', adminAgencySchema);
