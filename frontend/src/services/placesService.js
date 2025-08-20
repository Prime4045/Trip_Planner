const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'demo-key'

export const getPlaceDetails = async (placeName, destination) => {
  try {
    // For demo purposes, return mock data if no API key
    if (GOOGLE_PLACES_API_KEY === 'demo-key') {
      return {
        place_id: 'demo-place-id',
        name: placeName,
        rating: 4.5,
        formatted_address: `${placeName}, ${destination}`,
        geometry: { location: { lat: 0, lng: 0 } }
      }
    }

    const query = `${placeName} ${destination}`
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,rating,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error('Places API request failed')
    }
    
    const data = await response.json()
    return data.candidates?.[0] || null
  } catch (error) {
    console.error('Error fetching place details:', error)
    return null
  }
}

export const getPlacePhotos = async (placeId) => {
  if (!placeId || GOOGLE_PLACES_API_KEY === 'demo-key') {
    // Return demo photos
    return [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
    ]
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error('Place photos request failed')
    }
    
    const data = await response.json()
    const photos = data.result?.photos || []
    
    return photos.slice(0, 3).map(photo => 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
    )
  } catch (error) {
    console.error('Error fetching place photos:', error)
    return []
  }
}