const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  continent: {
    type: String,
    required: true,
    enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica']
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  avgCostPerDay: {
    type: Number,
    required: true
  },
  bestTimeToVisit: {
    months: [String],
    season: String
  },
  climate: {
    type: String,
    enum: ['tropical', 'temperate', 'arid', 'polar', 'mediterranean']
  },
  popularity: {
    type: Number,
    default: 0
  },
  images: [String],
  attractions: [{
    name: String,
    description: String,
    type: String
  }]
}, {
  timestamps: true
})

// Indexes for geospatial queries and search
destinationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 })
destinationSchema.index({ name: 'text', country: 'text', description: 'text' })
destinationSchema.index({ tags: 1 })
destinationSchema.index({ popularity: -1 })

module.exports = mongoose.model('Destination', destinationSchema)