const axios = require('axios')

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'eff3a486camsh086d6b63316604dp1dd9dajsn34941bd67005'
const RAPIDAPI_HOST = 'google-map-places-new-v2.p.rapidapi.com'
const BASE_URL = 'https://google-map-places-new-v2.p.rapidapi.com'

const rapidApiHeaders = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': RAPIDAPI_HOST,
  'Content-Type': 'application/json',
  'X-Goog-FieldMask': '*'
}

// Autocomplete for destination search
const autocompleteSearch = async (input) => {
  try {
    console.log('RapidAPI Autocomplete search for:', input)

    const response = await axios.post(`${BASE_URL}/v1/places:autocomplete`, {
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
      includedPrimaryTypes: ["locality", "administrative_area_level_1", "country"],
      includedRegionCodes: [],
      languageCode: "en",
      regionCode: "",
      origin: {
        latitude: 0,
        longitude: 0
      },
      inputOffset: 0,
      includeQueryPredictions: true,
      sessionToken: ""
    }, {
      headers: rapidApiHeaders
    })

    console.log('RapidAPI Autocomplete response:', response.data)

    if (response.data && response.data.suggestions) {
      return response.data.suggestions
        .filter(suggestion => suggestion.placePrediction)
        .map(suggestion => ({
          placeId: suggestion.placePrediction.placeId,
          description: suggestion.placePrediction.text.text,
          mainText: suggestion.placePrediction.structuredFormat?.mainText?.text || suggestion.placePrediction.text.text,
          secondaryText: suggestion.placePrediction.structuredFormat?.secondaryText?.text || ''
        }))
        .slice(0, 5)
    }

    return []
  } catch (error) {
    console.error('RapidAPI Autocomplete error:', error.response?.data || error.message)
    return []
  }
}

// Text Search for places
const textSearchPlaces = async (query, location) => {
  try {
    console.log('RapidAPI Text Search for:', query, 'in', location)

    const response = await axios.post(`${BASE_URL}/v1/places:searchText`, {
      textQuery: `${query} in ${location}`,
      languageCode: "en",
      regionCode: "",
      rankPreference: 0,
      includedType: "",
      openNow: false,
      minRating: 0,
      maxResultCount: 10,
      priceLevels: [],
      strictTypeFiltering: false,
      locationBias: {
        circle: {
          center: {
            latitude: 40,
            longitude: -110
          },
          radius: 50000
        }
      }
    }, {
      headers: rapidApiHeaders
    })

    console.log('RapidAPI Text Search response:', response.data)

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

    return []
  } catch (error) {
    console.error('RapidAPI Text Search error:', error.response?.data || error.message)
    return []
  }
}

// Get Place Details
const getPlaceDetails = async (placeId) => {
  try {
    console.log('RapidAPI Place Details for:', placeId)

    const response = await axios.get(`${BASE_URL}/v1/places/${placeId}`, {
      headers: rapidApiHeaders
    })

    console.log('RapidAPI Place Details response:', response.data)

    if (response.data) {
      const place = response.data
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

    return null
  } catch (error) {
    console.error('RapidAPI Place Details error:', error.response?.data || error.message)
    return null
  }
}

// Get Place Photos
const getPlacePhotos = async (placeId) => {
  try {
    console.log('RapidAPI Place Photos for:', placeId)

    // First get place details to get photo references
    const placeDetails = await getPlaceDetails(placeId)

    if (!placeDetails || !placeDetails.photos || placeDetails.photos.length === 0) {
      return []
    }

    const photoUrls = []

    // Get up to 3 photos
    for (let i = 0; i < Math.min(3, placeDetails.photos.length); i++) {
      const photo = placeDetails.photos[i]
      if (photo.name) {
        try {
          const photoResponse = await axios.get(`${BASE_URL}/v1/${photo.name}/media`, {
            params: {
              maxWidthPx: 400,
              maxHeightPx: 400,
              skipHttpRedirect: true
            },
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': RAPIDAPI_HOST
            }
          })

          if (photoResponse.data && photoResponse.data.photoUri) {
            photoUrls.push(photoResponse.data.photoUri)
          }
        } catch (photoError) {
          console.error('Photo fetch error:', photoError.message)
        }
      }
    }

    return photoUrls
  } catch (error) {
    console.error('RapidAPI Place Photos error:', error.response?.data || error.message)
    return []
  }
}

// Nearby Search for places
const nearbySearchPlaces = async (latitude, longitude, radius = 5000, type = '') => {
  try {
    console.log('RapidAPI Nearby Search for:', latitude, longitude)

    const response = await axios.post(`${BASE_URL}/v1/places:searchNearby`, {
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
      languageCode: "en",
      includedTypes: type ? [type] : undefined
    }, {
      headers: rapidApiHeaders
    })

    console.log('RapidAPI Nearby Search response:', response.data)

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

    return []
  } catch (error) {
    console.error('RapidAPI Nearby Search error:', error.response?.data || error.message)
    return []
  }
}

module.exports = {
  autocompleteSearch,
  textSearchPlaces,
  getPlaceDetails,
  getPlacePhotos,
  nearbySearchPlaces
}