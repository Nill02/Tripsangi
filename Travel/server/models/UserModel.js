import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    /* ---------- BASIC INFO ---------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ---------- PERSONAL DETAILS ---------- */
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    age: {
      type: Number,
      min: 1,
      max: 120,
    },

    dateOfBirth: {
      type: Date,
    },

    /* ---------- PERMANENT LOCATION ---------- */
    homeLocation: {
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, default: 'India' },
    },

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    /* ---------- TRAVEL PREFERENCES ---------- */
    interests: [
      {
        type: String,
        enum: ['nature', 'history', 'food', 'adventure', 'religious', 'shopping'],
      },
    ],

    budgetPreference: {
      type: String,
      enum: ['low', 'medium', 'luxury'],
      default: 'medium',
    },

    crowdPreference: {
      type: String,
      enum: ['avoid', 'normal'],
      default: 'avoid',
    },

    travelStyle: {
      type: String,
      enum: ['solo', 'couple', 'family', 'group'],
      default: 'solo',
    },

    /* ---------- SAFETY & EMERGENCY ---------- */
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },

    medicalNotes: {
      type: String,
    },

    /* ---------- SYSTEM ---------- */
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },

    savedTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],

    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
);

/* 🔑 HASH PASSWORD */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/* 🔓 COMPARE PASSWORD */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
