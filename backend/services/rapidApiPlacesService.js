const axios = require('axios')

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'demo-key'
const RAPIDAPI_HOST = 'google-map-places-new-v2.p.rapidapi.com'
const BASE_URL = 'https://google-map-places-new-v2.p.rapidapi.com'

const rapidApiHeaders = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': RAPIDAPI_HOST,
  'Content-Type': 'application/json'
}

// Text Search for places
const textSearchPlaces = async (query, location) => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key') {
      console.log('Using mock places data - RapidAPI key not configured')
      return generateMockPlaces(query, location)
    }

    const response = await axios.post(`${BASE_URL}/textsearch`, {
      textQuery: `${query} in ${location}`,
      maxResultCount: 10,
      languageCode: 'en'
    }, {
      headers: rapidApiHeaders
    })

    if (response.data && response.data.places) {
      return response.data.places.map(place => ({
        placeId: place.id,
        name: place.displayName?.text || place.name,
        rating: place.rating || 4.0,
        address: place.formattedAddress,
        location: place.location,
        photos: place.photos || [],
        priceLevel: place.priceLevel || 2,
        types: place.types || []
      }))
    }

    return generateMockPlaces(query, location)
  } catch (error) {
    console.error('RapidAPI Text Search error:', error.response?.data || error.message)
    return generateMockPlaces(query, location)
  }
}

// Nearby Search for places
const nearbySearchPlaces = async (latitude, longitude, radius = 5000, type = '') => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key') {
      console.log('Using mock nearby places - RapidAPI key not configured')
      return generateMockNearbyPlaces()
    }

    const response = await axios.post(`${BASE_URL}/nearbysearch`, {
      locationRestriction: {
        circle: {
          center: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          },
          radius: radius
        }
      },
      maxResultCount: 20,
      languageCode: 'en',
      includedTypes: type ? [type] : undefined
    }, {
      headers: rapidApiHeaders
    })

    if (response.data && response.data.places) {
      return response.data.places.map(place => ({
        placeId: place.id,
        name: place.displayName?.text || place.name,
        rating: place.rating || 4.0,
        address: place.formattedAddress,
        location: place.location,
        photos: place.photos || [],
        priceLevel: place.priceLevel || 2,
        types: place.types || []
      }))
    }

    return generateMockNearbyPlaces()
  } catch (error) {
    console.error('RapidAPI Nearby Search error:', error.response?.data || error.message)
    return generateMockNearbyPlaces()
  }
}

// Get Place Details
const getPlaceDetails = async (placeId) => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key' || !placeId) {
      console.log('Using mock place details - RapidAPI key not configured')
      return generateMockPlaceDetails(placeId)
    }

    const response = await axios.get(`${BASE_URL}/place-details`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_address,geometry,photos,price_level,types,opening_hours,website,international_phone_number'
      },
      headers: rapidApiHeaders
    })

    if (response.data && response.data.result) {
      const place = response.data.result
      return {
        placeId: place.id,
        name: place.displayName?.text || place.name,
        rating: place.rating || 4.0,
        address: place.formattedAddress,
        location: place.location,
        photos: place.photos || [],
        priceLevel: place.priceLevel || 2,
        types: place.types || [],
        openingHours: place.regularOpeningHours,
        website: place.websiteUri,
        phoneNumber: place.internationalPhoneNumber
      }
    }

    return generateMockPlaceDetails(placeId)
  } catch (error) {
    console.error('RapidAPI Place Details error:', error.response?.data || error.message)
    return generateMockPlaceDetails(placeId)
  }
}

// Get Place Photos
const getPlacePhotos = async (placeId) => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key' || !placeId) {
      console.log('Using mock photos - RapidAPI key not configured')
      return generateMockPhotos()
    }

    const response = await axios.get(`${BASE_URL}/place-photo`, {
      params: {
        place_id: placeId,
        maxwidth: 800
      },
      headers: rapidApiHeaders
    })

    if (response.data && response.data.photos) {
      return response.data.photos.slice(0, 5)
    }

    return generateMockPhotos()
  } catch (error) {
    console.error('RapidAPI Place Photos error:', error.response?.data || error.message)
    return generateMockPhotos()
  }
}

// Autocomplete for search suggestions
const autocompleteSearch = async (input, location) => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key') {
      console.log('Using mock autocomplete - RapidAPI key not configured')
      return generateMockAutocomplete(input)
    }

    const response = await axios.post(`${BASE_URL}/autocomplete`, {
      input: input,
      locationBias: {
        circle: {
          center: {
            latitude: 20.5937,
            longitude: 78.9629
          },
          radius: 2000000
        }
      },
      languageCode: 'en'
    }, {
      headers: rapidApiHeaders
    })

    if (response.data && response.data.suggestions) {
      return response.data.suggestions.map(suggestion => ({
        placeId: suggestion.placePrediction?.placeId,
        description: suggestion.placePrediction?.text?.text,
        mainText: suggestion.placePrediction?.structuredFormat?.mainText?.text,
        secondaryText: suggestion.placePrediction?.structuredFormat?.secondaryText?.text
      }))
    }

    return generateMockAutocomplete(input)
  } catch (error) {
    console.error('RapidAPI Autocomplete error:', error.response?.data || error.message)
    return generateMockAutocomplete(input)
  }
}

// Mock data generators for when API is not available
const generateMockPlaces = (query, location) => {
  const mockPlaces = [
    'Red Fort', 'India Gate', 'Taj Mahal', 'Gateway of India', 'Hawa Mahal',
    'Golden Temple', 'Mysore Palace', 'Charminar', 'Victoria Memorial', 'Lotus Temple'
  ]
  
  return mockPlaces.slice(0, 5).map((name, index) => ({
    placeId: `mock_${Date.now()}_${index}`,
    name: `${name}, ${location}`,
    rating: 4.0 + Math.random() * 1.0,
    address: `${name}, ${location}, India`,
    location: {
      latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
      longitude: 77.2090 + (Math.random() - 0.5) * 0.1
    },
    photos: generateMockPhotos(),
    priceLevel: Math.floor(Math.random() * 4) + 1,
    types: ['tourist_attraction', 'point_of_interest']
  }))
}

const generateMockNearbyPlaces = () => {
  return [
    {
      placeId: 'mock_nearby_1',
      name: 'Local Restaurant',
      rating: 4.2,
      address: 'Near your location',
      photos: generateMockPhotos()
    }
  ]
}

const generateMockPlaceDetails = (placeId) => {
  return {
    placeId: placeId || `mock_${Date.now()}`,
    name: 'Sample Heritage Site',
    rating: 4.3,
    address: 'Sample Address, India',
    location: { latitude: 28.6139, longitude: 77.2090 },
    photos: generateMockPhotos(),
    priceLevel: 2,
    types: ['tourist_attraction'],
    openingHours: { periods: [] },
    website: 'https://example.com',
    phoneNumber: '+91 11 1234 5678'
  }
}

const generateMockPhotos = () => {
  const indianPhotos = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', // India Gate
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', // Taj Mahal
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', // Rajasthan
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // Kerala
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'  // Goa
  ]
  
  return indianPhotos.slice(0, 3)
}

const generateMockAutocomplete = (input) => {
  const suggestions = [
    'Delhi, India',
    'Mumbai, India', 
    'Bangalore, India',
    'Jaipur, Rajasthan',
    'Goa, India'
  ].filter(place => place.toLowerCase().includes(input.toLowerCase()))
  
  return suggestions.map((place, index) => ({
    placeId: `mock_auto_${index}`,
    description: place,
    mainText: place.split(',')[0],
    secondaryText: place.split(',').slice(1).join(',')
  }))
}

module.exports = {
  textSearchPlaces,
  nearbySearchPlaces,
  getPlaceDetails,
  getPlacePhotos,
  autocompleteSearch
}