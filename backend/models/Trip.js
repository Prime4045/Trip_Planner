const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  time: String,
  name: String,
  description: String,
  duration: String,
  cost: Number,
  type: {
    type: String,
    enum: ['attraction', 'restaurant', 'hotel', 'activity', 'transport', 'food', 'spiritual', 'shopping', 'cultural', 'sightseeing', 'entertainment', 'nature', 'adventure', 'relaxation']
  },
  location: String,
  placeId: String,
  rating: Number,
  address: String,
  photos: [String],
  googleMapsUrl: String
})

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: [activitySchema]
})

const itinerarySchema = new mongoose.Schema({
  destination: String,
  totalDays: Number,
  estimatedCost: {
    total: Number,
    accommodation: Number,
    food: Number,
    activities: Number,
    transport: Number
  },
  carbonFootprint: {
    total: Number,
    transport: Number,
    accommodation: Number
  },
  days: [daySchema]
})

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 1
  },
  budgetCategory: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  preferences: [{
    type: String,
    required: true
  }],
  itinerary: itinerarySchema,
  status: {
    type: String,
    enum: ['draft', 'planned', 'active', 'completed'],
    default: 'planned'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes for better query performance
tripSchema.index({ userId: 1, createdAt: -1 })
tripSchema.index({ destination: 1 })
tripSchema.index({ isPublic: 1, likes: -1 })

module.exports = mongoose.model('Trip', tripSchema)