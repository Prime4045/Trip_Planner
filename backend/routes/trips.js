const express = require('express')
const { body, validationResult } = require('express-validator')
const Trip = require('../models/Trip')
const auth = require('../middleware/auth')
const { generateItinerary } = require('../services/geminiService')
const { enrichWithPlaces } = require('../services/placesService')

const router = express.Router()

// Get all user trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json(trips)
  } catch (error) {
    console.error('Fetch trips error:', error)
    res.status(500).json({ message: 'Server error fetching trips' })
  }
})

// Get single trip
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).select('-__v')

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    res.json(trip)
  } catch (error) {
    console.error('Fetch trip error:', error)
    res.status(500).json({ message: 'Server error fetching trip' })
  }
})

// Create new trip
router.post('/', auth, [
  body('destination').trim().isLength({ min: 2 }).withMessage('Destination is required'),
  body('days').isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
  body('budget').isIn(['low', 'medium', 'high']).withMessage('Invalid budget option'),
  body('preferences').isArray({ min: 1 }).withMessage('At least one preference is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { destination, days, budget, preferences } = req.body

    // Generate AI itinerary
    const aiItinerary = await generateItinerary({
      destination,
      days,
      budget,
      preferences
    })

    // Enrich with Google Places data
    const enrichedItinerary = await enrichWithPlaces(aiItinerary)

    // Create trip
    const trip = new Trip({
      userId: req.userId,
      destination,
      days,
      budget,
      preferences,
      itinerary: enrichedItinerary
    })

    await trip.save()

    res.status(201).json(trip)
  } catch (error) {
    console.error('Create trip error:', error)
    res.status(500).json({ 
      message: 'Server error creating trip',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    })
  }
})

// Update trip
router.put('/:id', auth, [
  body('destination').optional().trim().isLength({ min: 2 }),
  body('days').optional().isInt({ min: 1, max: 30 }),
  body('budget').optional().isIn(['low', 'medium', 'high']),
  body('preferences').optional().isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body, updatedAt: new Date() },
      { new: true }
    )

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    res.json(trip)
  } catch (error) {
    console.error('Update trip error:', error)
    res.status(500).json({ message: 'Server error updating trip' })
  }
})

// Delete trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    res.json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Delete trip error:', error)
    res.status(500).json({ message: 'Server error deleting trip' })
  }
})

// Get trip statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = await Trip.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalDays: { $sum: '$days' },
          totalCost: { $sum: '$itinerary.estimatedCost.total' },
          destinations: { $addToSet: '$destination' },
          preferences: { $push: '$preferences' }
        }
      }
    ])

    const result = stats[0] || {
      totalTrips: 0,
      totalDays: 0,
      totalCost: 0,
      destinations: [],
      preferences: []
    }

    // Flatten and count preferences
    const flatPreferences = result.preferences.flat()
    const preferenceCount = flatPreferences.reduce((acc, pref) => {
      acc[pref] = (acc[pref] || 0) + 1
      return acc
    }, {})

    res.json({
      ...result,
      uniqueDestinations: result.destinations.length,
      topPreferences: Object.entries(preferenceCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([pref]) => pref)
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ message: 'Server error fetching statistics' })
  }
})

module.exports = router