const express = require('express')
const Destination = require('../models/Destination')

const router = express.Router()

// Get popular destinations
router.get('/popular', async (req, res) => {
  try {
    const destinations = await Destination.find()
      .sort({ popularity: -1 })
      .limit(20)
      .select('-__v')

    res.json(destinations)
  } catch (error) {
    console.error('Fetch destinations error:', error)
    res.status(500).json({ message: 'Server error fetching destinations' })
  }
})

// Search destinations
router.get('/search', async (req, res) => {
  try {
    const { q, tags, budget } = req.query
    let query = {}

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }

    if (tags) {
      const tagArray = tags.split(',')
      query.tags = { $in: tagArray }
    }

    if (budget) {
      const budgetRanges = {
        low: { $lte: 100 },
        medium: { $gte: 100, $lte: 300 },
        high: { $gte: 300 }
      }
      if (budgetRanges[budget]) {
        query.avgCostPerDay = budgetRanges[budget]
      }
    }

    const destinations = await Destination.find(query)
      .sort({ popularity: -1 })
      .limit(50)
      .select('-__v')

    res.json(destinations)
  } catch (error) {
    console.error('Search destinations error:', error)
    res.status(500).json({ message: 'Server error searching destinations' })
  }
})

// Get destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).select('-__v')
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' })
    }

    res.json(destination)
  } catch (error) {
    console.error('Fetch destination error:', error)
    res.status(500).json({ message: 'Server error fetching destination' })
  }
})

module.exports = router