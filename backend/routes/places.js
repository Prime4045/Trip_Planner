const express = require('express')
const { autocompleteSearch } = require('../services/placesService')

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

module.exports = router