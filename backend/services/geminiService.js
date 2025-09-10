const { GoogleGenerativeAI } = require('@google/generative-ai')
const { textSearchPlaces, getPlacePhotos } = require('./rapidApiPlacesService')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key')

// Get destination information including interests and minimum budget
const getDestinationInfo = async (destination) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      console.log('Using fallback destination info - Gemini API key not configured')
      return {
        interests: ['Must-see Attractions', 'Great Food', 'Hidden Gems', 'Tours & Experiences', 'Art and Culture', 'Adventure and Sports'],
        minimumBudget: 50000,
        currency: 'INR'
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Provide destination information for ${destination} in JSON format:

{
  "interests": ["list of 8-10 popular activities/interests specific to this destination - use descriptive names without emojis"],
  "minimumBudget": minimum_budget_per_person_in_INR_for_decent_trip,
  "currency": "INR",
  "description": "brief description of the destination"
}

Make the interests specific to ${destination} and use professional naming. For example:
- If it's Paris: ["Must-see Attractions", "French Cuisine", "Fashion Shopping", "Historic Architecture", "Seine River Cruise", "Café Culture", "Photography", "Wine Tasting"]
- If it's Tokyo: ["Sushi & Ramen", "Anime Culture", "Traditional Temples", "Modern Technology", "Cherry Blossoms", "Shopping Districts", "Karaoke", "Hot Springs"]
- If it's Rajasthan: ["Royal Heritage", "Desert Safari", "Traditional Crafts", "Rajasthani Cuisine", "Camel Experiences", "Folk Performances", "Heritage Hotels", "Photography"]

Provide realistic minimum budget in INR for a decent trip to ${destination}.

IMPORTANT: Respond ONLY with valid JSON, no markdown formatting or additional text.
`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    console.log('Gemini destination info response:', text.substring(0, 200))

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response')
    }

    const destinationInfo = JSON.parse(jsonMatch[0])
    console.log('Parsed destination info:', destinationInfo)

    return destinationInfo
  } catch (error) {
    console.error('Error getting destination info:', error.message)
    return {
      interests: ['Culture', 'Food', 'Shopping', 'Adventure', 'Nature', 'Photography'],
      minimumBudget: 50000,
      currency: 'INR'
    }
  }
}

const generateItinerary = async (tripData) => {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      console.log('Using fallback itinerary - Gemini API key not configured')
      return generateFallbackItinerary(tripData)
    }

    console.log('Generating itinerary with Gemini AI for:', `${tripData.fromLocation} to ${tripData.destination}`)

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Create a detailed ${tripData.days}-day travel itinerary for ${tripData.destination} with REAL places and activities.

Trip Details:
- From: ${tripData.fromLocation}
- To: ${tripData.destination}
- Total Budget: ${tripData.totalBudget} (distribute across all expenses)
- Days: ${tripData.days}
- Start Date: ${tripData.startDate}
- End Date: ${tripData.endDate}
- Trip Type: ${tripData.tripType}
- Preferences: ${tripData.preferences.join(', ')}
- With Children: ${tripData.withChildren ? 'Yes' : 'No'}
- With Pets: ${tripData.withPets ? 'Yes' : 'No'}

IMPORTANT: 
1. Generate EXACTLY ${tripData.days} days of activities
2. For each activity, use ONLY these type values: 'attraction', 'restaurant', 'hotel', 'activity', 'transport', 'spiritual', 'shopping', 'cultural', 'sightseeing', 'entertainment', 'nature', 'adventure', 'relaxation'
3. Include REAL place names specific to ${tripData.destination}
4. Make activities appropriate for ${tripData.tripType} travelers
5. Consider the budget of ${tripData.totalBudget} INR for ${tripData.days} days

Please provide a JSON response with this exact structure:
{
  "destination": "${tripData.destination}",
  "totalDays": ${tripData.days},
  "startDate": "${tripData.startDate}",
  "endDate": "${tripData.endDate}",
  "estimatedCost": {
    "total": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0,
    "currency": "USD"
  },
  "carbonFootprint": {
    "total": 0,
    "transport": 0,
    "accommodation": 0
  },
  "days": [
    {
      "day": 1,
      "title": "Arrival & ${tripData.destination} Exploration",
      "activities": [
        {
          "time": "09:00",
          "name": "REAL place name in ${tripData.destination}",
          "description": "Detailed description of the activity",
          "duration": "2 hours",
          "cost": realistic_cost_in_INR,
          "type": "attraction",
          "location": "Specific area in ${tripData.destination}",
          "googleMapsUrl": "https://www.google.com/maps/search/place+name+${tripData.destination}",
          "rating": 4.5,
          "photos": []
        }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Generate activities for ALL ${tripData.days} days
- Use REAL place names from ${tripData.destination}
- Make it specific to ${tripData.tripType} (solo/partner/friends/family)
- Include local cuisine and authentic experiences
- Budget should be realistic for ${tripData.destination}
- Each day should have 4-6 activities with proper timing

${tripData.withChildren ? 'Include family-friendly activities suitable for children.' : ''}
${tripData.withPets ? 'Include pet-friendly locations and activities.' : ''}

IMPORTANT: Respond ONLY with valid JSON, no markdown formatting or additional text.
`

    // Fixed API call - no extra await
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    console.log('Gemini API response received, length:', text.length)

    // Clean and parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log('AI response format invalid, using fallback. Response:', text.substring(0, 200))
      return generateFallbackItinerary(tripData)
    }

    let itinerary
    try {
      itinerary = JSON.parse(jsonMatch[0])
      console.log('Successfully parsed Gemini response')
    } catch (parseError) {
      console.log('JSON parse failed, using fallback. Error:', parseError.message)
      return generateFallbackItinerary(tripData)
    }

    // Validate and enhance the response
    return validateAndEnhanceItinerary(itinerary, tripData)

  } catch (error) {
    console.error('Error generating itinerary:', error.message)
    console.error('Full error:', error)

    // Fallback itinerary
    return generateFallbackItinerary(tripData)
  }
}

// Enhance itinerary with real photos from RapidAPI
const enhanceWithRealPhotos = async (itinerary) => {
  try {
    console.log('Enhancing itinerary with real photos...')
    
    for (const day of itinerary.days) {
      for (const activity of day.activities) {
        try {
          // Search for the place using RapidAPI
          const places = await textSearchPlaces(activity.name, itinerary.destination)
          
          if (places && places.length > 0) {
            const place = places[0]
            
            // Get photos for this place
            const photos = await getPlacePhotos(place.placeId)
            
            if (photos && photos.length > 0) {
              activity.photos = photos
              activity.placeId = place.placeId
              activity.rating = place.rating || activity.rating
              activity.address = place.address || activity.location
            }
          }
        } catch (error) {
          console.error(`Error enhancing ${activity.name}:`, error.message)
        }
      }
    }
    
    return itinerary
  } catch (error) {
    console.error('Error enhancing with photos:', error)
    return itinerary
  }
}

const validateAndEnhanceItinerary = (itinerary, tripData) => {
  console.log('Validating and enhancing itinerary')

  // Map invalid types to valid ones
  const typeMapping = {
    'food': 'restaurant',
    'dining': 'restaurant',
    'meal': 'restaurant',
    'temple': 'spiritual',
    'shrine': 'spiritual',
    'market': 'shopping',
    'bazaar': 'shopping',
    'mall': 'shopping',
    'monument': 'attraction',
    'museum': 'attraction',
    'palace': 'attraction',
    'fort': 'attraction',
    'tour': 'activity',
    'experience': 'activity',
    'adventure': 'activity'
  }

  // Ensure all required fields exist
  const enhanced = {
    destination: itinerary.destination || tripData.destination,
    startDate: itinerary.startDate || tripData.startDate,
    endDate: itinerary.endDate || tripData.endDate,
    totalDays: itinerary.totalDays || tripData.days,
    estimatedCost: itinerary.estimatedCost || {
      total: tripData.totalBudget,
      accommodation: 0,
      food: 0,
      activities: 0,
      transport: 0,
      currency: "USD"
    },
    carbonFootprint: itinerary.carbonFootprint || {
      total: calculateCarbonFootprint(tripData.destination, tripData.days),
      transport: 0,
      accommodation: 0
    },
    days: itinerary.days || []
  }

  // Ensure we have the right number of days
  while (enhanced.days.length < tripData.days) {
    enhanced.days.push({
      day: enhanced.days.length + 1,
      title: `Day ${enhanced.days.length + 1} - ${tripData.destination} Adventure`,
      activities: [
        {
          time: "09:00",
          name: `${tripData.destination} City Tour`,
          description: `Explore the main attractions and highlights of ${tripData.destination}`,
          duration: "3 hours",
          cost: Math.round(tripData.totalBudget / tripData.days * 0.3),
          type: "activity",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' attractions')}`,
          rating: 4.2,
          photos: []
        }
      ]
    })
  }

  // Fix activity types to match schema enum
  enhanced.days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.type && typeMapping[activity.type.toLowerCase()]) {
        activity.type = typeMapping[activity.type.toLowerCase()]
      } else if (!['attraction', 'restaurant', 'hotel', 'activity', 'transport', 'food', 'spiritual', 'shopping', 'cultural', 'sightseeing', 'entertainment', 'nature', 'adventure', 'relaxation'].includes(activity.type)) {
        activity.type = 'activity' // Default fallback
      }
    })
  })

  // Recalculate costs if needed
  if (!enhanced.estimatedCost.total || enhanced.estimatedCost.total === 0) {
    const totalCost = tripData.totalBudget

    enhanced.estimatedCost.total = totalCost
    enhanced.estimatedCost.accommodation = Math.round(totalCost * 0.4)
    enhanced.estimatedCost.food = Math.round(totalCost * 0.3)
    enhanced.estimatedCost.activities = Math.round(totalCost * 0.2)
    enhanced.estimatedCost.transport = Math.round(totalCost * 0.1)
  }

  return enhanced
}

const generateFallbackItinerary = (tripData) => {
  console.log('Generating fallback itinerary for:', tripData.destination)

  const dailyBudget = Math.round(tripData.totalBudget / tripData.days)

  return {
    destination: tripData.destination,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    totalDays: tripData.days,
    estimatedCost: {
      total: tripData.totalBudget,
      accommodation: dailyBudget * 0.4 * tripData.days,
      food: dailyBudget * 0.3 * tripData.days,
      activities: dailyBudget * 0.2 * tripData.days,
      transport: dailyBudget * 0.1 * tripData.days,
      currency: "USD"
    },
    carbonFootprint: {
      total: calculateCarbonFootprint(tripData.destination, tripData.days),
      transport: 50 * tripData.days,
      accommodation: 20 * tripData.days
    },
    days: Array.from({ length: tripData.days }, (_, index) => ({
      day: index + 1,
      title: `Day ${index + 1} - Discover ${tripData.destination}`,
      activities: [
        {
          time: "09:00",
          name: "Morning City Tour",
          description: `Start your day exploring the highlights of ${tripData.destination}`,
          duration: "3 hours",
          cost: Math.round(dailyBudget * 0.3),
          type: "activity",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' attractions')}`
        },
        {
          time: "13:00",
          name: "Local Restaurant",
          description: `Experience authentic local cuisine in ${tripData.destination}`,
          duration: "1 hour",
          cost: Math.round(dailyBudget * 0.2),
          type: "restaurant",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' restaurants')}`
        },
        {
          time: "15:00",
          name: "Popular Attraction",
          description: `Visit one of the most popular attractions in ${tripData.destination}`,
          duration: "2 hours",
          cost: Math.round(dailyBudget * 0.25),
          type: "attraction",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' attractions')}`
        }
      ]
    }))
  }
}

const calculateCarbonFootprint = (destination, days) => {
  // Simple calculation based on destination and duration
  const baseFootprint = 50 // kg CO2 per day
  const destinationMultiplier = getDestinationCarbonMultiplier(destination)
  return Math.round(baseFootprint * days * destinationMultiplier)
}

const getDestinationCarbonMultiplier = (destination) => {
  // Simple multiplier based on typical travel distance
  const lowerCaseDestination = destination.toLowerCase()
  
  if (lowerCaseDestination.includes('europe') || lowerCaseDestination.includes('usa')) {
    return 1.5 // Higher for international travel
  } else if (lowerCaseDestination.includes('asia')) {
    return 1.2
  }
  
  return 1.0 // Default multiplier
}

module.exports = {
  generateItinerary,
  getDestinationInfo,
  enhanceWithRealPhotos
}