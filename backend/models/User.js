const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  preferences: {
    favoriteDestinations: [String],
    travelStyle: {
      type: String,
      enum: ['budget', 'comfort', 'luxury'],
      default: 'comfort'
    },
    interests: [String]
  },
  stats: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalDays: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for faster queries
userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)