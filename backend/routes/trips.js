const express = require('express')
const { body, validationResult } = require('express-validator')
const { requiresAuth } = require('express-openid-connect')
const Trip = require('../models/Trip')
const User = require('../models/User')
const { generateItinerary, getDestinationInfo, enhanceWithRealPhotos } = require('../services/geminiService')

const router = express.Router()

// Get destination information (interests and minimum budget)
router.post('/destination-info', async (req, res) => {
  try {
    const { destination } = req.body

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' })
    }

    console.log('Getting destination info for:', destination)
    const destinationInfo = await getDestinationInfo(destination)

    res.json(destinationInfo)
  } catch (error) {
    console.error('Destination info error:', error)
    res.status(500).json({ message: 'Server error getting destination info' })
  }
})

// Get all user trips
router.get('/', requiresAuth(), async (req, res) => {
  try {
    console.log('Fetching trips for user:', req.user._id)
    const trips = await Trip.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json(trips)
  } catch (error) {
    console.error('Fetch trips error:', error)
    res.status(500).json({ message: 'Server error fetching trips' })
  }
})

// Get single trip
router.get('/:id', requiresAuth(), async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id
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
router.post('/', requiresAuth(), [
  body('fromLocation').trim().isLength({ min: 2 }).withMessage('Starting location is required'),
  body('destination').trim().isLength({ min: 2 }).withMessage('Destination is required'),
  body('days').isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
  body('budget').isIn(['low', 'medium', 'high']).withMessage('Invalid budget option'),
  body('preferences').isArray({ min: 1 }).withMessage('At least one preference is required'),
  body('travelType').isIn(['solo', 'couple', 'friends', 'family']).withMessage('Invalid travel type'),
  body('memberCount').optional().isInt({ min: 1, max: 10 }).withMessage('Member count must be between 1 and 10'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('totalBudget').isInt({ min: 1 }).withMessage('Total budget must be a positive number')
], async (req, res) => {
  try {
    console.log('Creating trip for user:', req.user._id)
    console.log('Trip data:', req.body)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    // Destructure all required fields
    const {
      fromLocation,
      destination,
      startDate,
      endDate,
      days,
      budget,
      preferences,
      travelType,
      memberCount,
      totalBudget
    } = req.body;

    // Calculate days from dates if not provided
    let tripDays = days;
    if (!tripDays && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    if (tripDays <= 0 || tripDays > 365) {
      return res.status(400).json({ message: 'Invalid date range. Trip must be between 1 and 365 days.' })
    }

    console.log('Calling Gemini API to generate itinerary...');
    // Generate AI itinerary
    const aiItinerary = await generateItinerary({
      fromLocation,
      destination,
      startDate,
      endDate,
      days: tripDays,
      budget,
      preferences,
      travelType,
      memberCount: memberCount || 1,
      totalBudget
    });

    console.log('Itinerary generated successfully')

    // Enhance itinerary with real photos from RapidAPI
    console.log('Enhancing itinerary with real photos...')
    const enrichedItinerary = await enhanceWithRealPhotos(aiItinerary)

    // Create trip
    const trip = new Trip({
      userId: req.user._id,
      fromLocation,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days: tripDays,
      totalBudget,
      preferences,
      travelType,
      memberCount: memberCount || 1,
      itinerary: enrichedItinerary
    })

    await trip.save()
    console.log('Trip saved to database with ID:', trip._id)

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'stats.totalTrips': 1,
        'stats.totalDays': tripDays,
        'stats.totalSpent': totalBudget
      }
    })

    console.log('User stats updated')
    res.status(201).json(trip)
  } catch (error) {
    console.error('Create trip error:', error)
    console.error('Error details:', error.message)
    console.error('Stack trace:', error.stack)
    res.status(500).json({
      message: 'Server error creating trip',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    })
  }
})

// Update trip
router.put('/:id', requiresAuth(), [
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
      { _id: req.params.id, userId: req.user._id },
      { $set: { ...req.body, updatedAt: new Date() } },
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
router.delete('/:id', requiresAuth(), async (req, res) => {
  try {
    console.log('Delete request for trip ID:', req.params.id)
    console.log('User ID:', req.user._id)

    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!trip) {
      console.log('Trip not found for deletion')
      return res.status(404).json({ message: 'Trip not found' })
    }

    console.log('Trip deleted successfully:', trip._id)

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'stats.totalTrips': -1,
        'stats.totalDays': -trip.days,
        'stats.totalSpent': -(trip.itinerary?.estimatedCost?.total || 0)
      }
    })

    res.json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Delete trip error:', error)
    console.error('Error details:', error.message)
    res.status(500).json({ message: 'Server error deleting trip' })
  }
})

// Get trip statistics
router.get('/stats/summary', requiresAuth(), async (req, res) => {
  try {
    const stats = await Trip.aggregate([
      { $match: { userId: req.user._id } },
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
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([pref]) => pref)
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ message: 'Server error fetching statistics' })
  }
})

module.exports = router