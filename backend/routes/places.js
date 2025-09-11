const express = require('express')
const { 
  autocompleteSearch,
  textSearchPlaces, 
  nearbySearchPlaces, 
  getPlaceDetails, 
  getPlacePhotos
} = require('../services/rapidApiPlacesService')

const router = express.Router()

// Autocomplete search for destinations
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query

    if (!input || input.length < 2) {
      return res.json([])
    }

    console.log('Autocomplete request for:', input)
    const suggestions = await autocompleteSearch(input)
    console.log('Returning suggestions:', suggestions.length)

    res.json(suggestions)
  } catch (error) {
    console.error('Autocomplete error:', error)
    res.status(500).json({ message: 'Server error with autocomplete' })
  }
})

// Text search places
router.get('/search', async (req, res) => {
  try {
    const { query, location } = req.query

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' })
    }

    const places = await textSearchPlaces(query, location)
    res.json(places)
  } catch (error) {
    console.error('Places search error:', error)
    res.status(500).json({ message: 'Server error searching places' })
  }
})

// Nearby search places
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius, type } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' })
    }

    const places = await nearbySearchPlaces(lat, lng, radius, type)
    res.json(places)
  } catch (error) {
    console.error('Nearby places error:', error)
    res.status(500).json({ message: 'Server error searching nearby places' })
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