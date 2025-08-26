const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
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
  avatar: {
    type: String,
    default: ''
  },
  googleAvatar: {
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
    interests: [String],
    budgetRange: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
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
    },
    countriesVisited: {
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
userSchema.index({ auth0Id: 1 })
userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)