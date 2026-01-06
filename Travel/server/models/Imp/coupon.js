import mongoose from 'mongoose';


const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      uppercase: true,
    },

    discountPercent: Number,

    maxDiscountAmount: Number,

    expiryDate: Date,

    usageLimit: Number,

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Coupon', couponSchema);
