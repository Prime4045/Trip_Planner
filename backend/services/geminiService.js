const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key')

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
Create a detailed ${tripData.days}-day travel itinerary for ${tripData.destination}.

Trip Details:
- Total Budget: ${tripData.totalBudget} (distribute across all expenses)
- Days: ${tripData.days}
- Start Date: ${tripData.startDate}
- End Date: ${tripData.endDate}
- Preferences: ${tripData.preferences.join(', ')}
- Trip Type: ${tripData.tripType || 'general'}
- With Children: ${tripData.withChildren ? 'Yes' : 'No'}
- With Pets: ${tripData.withPets ? 'Yes' : 'No'}
- Destination: ${tripData.destination}

IMPORTANT: For each activity, use ONLY these type values: 'attraction', 'restaurant', 'hotel', 'activity', 'transport', 'food', 'spiritual', 'shopping', 'cultural', 'sightseeing', 'entertainment', 'nature', 'adventure', 'relaxation'

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
      "title": "Day title",
      "activities": [
        {
          "time": "09:00",
          "name": "Activity name",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": 500,
          "type": "attraction",
          "location": "Specific address or area",
          "googleMapsUrl": "https://www.google.com/maps/search/activity+name+${tripData.destination}"
        }
      ]
    }
  ]
}

Make the itinerary specific to ${tripData.destination} with real places, attractions, and local experiences.
Include authentic local cuisine, popular tourist spots, and hidden gems.
Consider the trip type (${tripData.tripType}) and adjust activities accordingly.
${tripData.withChildren ? 'Include family-friendly activities suitable for children.' : ''}
${tripData.withPets ? 'Include pet-friendly locations and activities.' : ''}

Budget guidelines:
- Distribute the total budget of ${tripData.totalBudget} across ${tripData.days} days
- Daily budget: approximately ${Math.round(tripData.totalBudget / tripData.days)} per day
- Include local transportation and activities

Activity type guidelines:
- Use 'restaurant' for dining experiences
- Use 'attraction' for monuments, museums, landmarks
- Use 'activity' for tours, experiences, adventures
- Use 'hotel' for accommodation
- Use 'transport' for travel between cities
- Use 'spiritual' for temples, ashrams, religious sites
- Use 'shopping' for markets, malls, local crafts
- Use 'cultural' for cultural shows, festivals

Include 4-6 activities per day with realistic timing. Provide specific place names and locations in ${tripData.destination}.
Make sure all costs are realistic for ${tripData.destination} and add up correctly in the estimatedCost section.
Focus on authentic local experiences and popular attractions specific to ${tripData.destination}.

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
      title: `Day ${enhanced.days.length + 1} - Explore ${tripData.destination}`,
      activities: [
        {
          time: "09:00",
          name: "Morning City Tour",
          description: `Explore the highlights and attractions of ${tripData.destination}`,
          duration: "3 hours",
          cost: Math.round(tripData.totalBudget / tripData.days * 0.3),
          type: "activity",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' attractions')}`
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
  generateItinerary
}