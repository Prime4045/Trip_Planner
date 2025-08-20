const axios = require('axios')

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'demo-key'
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

const searchPlaces = async (query, location, type = '') => {
  try {
    if (GOOGLE_PLACES_API_KEY === 'demo-key') {
      return generateMockPlaces(query, location)
    }

    const params = {
      input: `${query} ${location}`,
      inputtype: 'textquery',
      fields: 'place_id,name,rating,formatted_address,geometry,photos,price_level,types',
      key: GOOGLE_PLACES_API_KEY
    }

    if (type) {
      params.type = type
    }

    const response = await axios.get(`${PLACES_BASE_URL}/findplacefromtext/json`, { params })
    
    if (response.data.status === 'OK') {
      return response.data.candidates || []
    }
    
    throw new Error(`Places API error: ${response.data.status}`)
  } catch (error) {
    console.error('Places search error:', error)
    return generateMockPlaces(query, location)
  }
}

const getPlaceDetails = async (placeId) => {
  try {
    if (GOOGLE_PLACES_API_KEY === 'demo-key' || !placeId) {
      return generateMockPlaceDetails(placeId)
    }

    const params = {
      place_id: placeId,
      fields: 'place_id,name,rating,formatted_address,geometry,photos,price_level,types,opening_hours,website,international_phone_number',
      key: GOOGLE_PLACES_API_KEY
    }

    const response = await axios.get(`${PLACES_BASE_URL}/details/json`, { params })
    
    if (response.data.status === 'OK') {
      return response.data.result
    }
    
    throw new Error(`Place details API error: ${response.data.status}`)
  } catch (error) {
    console.error('Place details error:', error)
    return generateMockPlaceDetails(placeId)
  }
}

const getPlacePhotos = async (placeId) => {
  try {
    if (GOOGLE_PLACES_API_KEY === 'demo-key' || !placeId) {
      return generateMockPhotos()
    }

    // First get place details to get photo references
    const placeDetails = await getPlaceDetails(placeId)
    
    if (!placeDetails || !placeDetails.photos) {
      return generateMockPhotos()
    }

    // Convert photo references to URLs
    const photoUrls = placeDetails.photos.slice(0, 5).map(photo => 
      `${PLACES_BASE_URL}/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
    )

    return photoUrls
  } catch (error) {
    console.error('Place photos error:', error)
    return generateMockPhotos()
  }
}

const enrichWithPlaces = async (itinerary) => {
  try {
    const enrichedDays = await Promise.all(
      itinerary.days.map(async (day) => {
        const enrichedActivities = await Promise.all(
          day.activities.map(async (activity) => {
            try {
              // Search for the place
              const places = await searchPlaces(activity.name, itinerary.destination, activity.type)
              const place = places[0] // Take the first result
              
              if (place) {
                const photos = await getPlacePhotos(place.place_id)
                
                return {
                  ...activity,
                  placeId: place.place_id,
                  rating: place.rating || 4.0,
                  address: place.formatted_address || activity.location,
                  photos: photos,
                  googleMapsUrl: place.place_id 
                    ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`
                }
              }
              
              return {
                ...activity,
                googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`,
                photos: generateMockPhotos()
              }
            } catch (error) {
              console.error('Error enriching activity:', error)
              return {
                ...activity,
                googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`,
                photos: generateMockPhotos()
              }
            }
          })
        )
        
        return {
          ...day,
          activities: enrichedActivities
        }
      })
    )

    return {
      ...itinerary,
      days: enrichedDays
    }
  } catch (error) {
    console.error('Error enriching itinerary with places:', error)
    return itinerary
  }
}

// Mock data generators for demo purposes
const generateMockPlaces = (query, location) => {
  return [
    {
      place_id: `mock_${Date.now()}_1`,
      name: query,
      rating: 4.2 + Math.random() * 0.8,
      formatted_address: `${query}, ${location}`,
      geometry: {
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1
        }
      },
      price_level: Math.floor(Math.random() * 4) + 1
    }
  ]
}

const generateMockPlaceDetails = (placeId) => {
  return {
    place_id: placeId || `mock_${Date.now()}`,
    name: 'Sample Place',
    rating: 4.2 + Math.random() * 0.8,
    formatted_address: 'Sample Address, Sample City',
    geometry: {
      location: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    price_level: Math.floor(Math.random() * 4) + 1,
    photos: [
      { photo_reference: 'mock_photo_1' },
      { photo_reference: 'mock_photo_2' },
      { photo_reference: 'mock_photo_3' }
    ]
  }
}

const generateMockPhotos = () => {
  const unsplashPhotos = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800'
  ]
  
  return unsplashPhotos.slice(0, 3)
}

module.exports = {
  searchPlaces,
  getPlaceDetails,
  getPlacePhotos,
  enrichWithPlaces
}