const express = require('express')
const { getPlaceDetails, getPlacePhotos, searchPlaces } = require('../services/placesService')

const router = express.Router()

// Search places
router.get('/search', async (req, res) => {
  try {
    const { query, location, type } = req.query

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' })
    }

    const places = await searchPlaces(query, location, type)
    res.json(places)
  } catch (error) {
    console.error('Places search error:', error)
    res.status(500).json({ message: 'Server error searching places' })
  }
})

// Get place details
router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params
    const details = await getPlaceDetails(placeId)
    
    if (!details) {
      return res.status(404).json({ message: 'Place not found' })
    }

    res.json(details)
  } catch (error) {
    console.error('Place details error:', error)
    res.status(500).json({ message: 'Server error fetching place details' })
  }
})

// Get place photos
router.get('/photos/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params
    const photos = await getPlacePhotos(placeId)
    
    res.json({ photos })
  } catch (error) {
    console.error('Place photos error:', error)
    res.status(500).json({ message: 'Server error fetching place photos' })
  }
})

module.exports = router