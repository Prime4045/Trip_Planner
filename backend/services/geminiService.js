const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key')

const generateItinerary = async (tripData) => {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      console.log('Using fallback itinerary - Gemini API key not configured')
      return generateFallbackItinerary(tripData)
    }

    console.log('Generating itinerary with Gemini AI for:', tripData.destination)

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Create a detailed ${tripData.days}-day travel itinerary for ${tripData.destination}, India.

Trip Details:
- Budget: ${tripData.budget}
- Days: ${tripData.days}
- Preferences: ${tripData.preferences.join(', ')}
- Currency: Indian Rupees (₹)
- Focus on Indian destinations, culture, and experiences

Please provide a JSON response with this exact structure:
{
  "destination": "${tripData.destination}",
  "totalDays": ${tripData.days},
  "estimatedCost": {
    "total": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0,
    "currency": "INR"
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
          "location": "Specific address or area in India",
          "googleMapsUrl": "https://www.google.com/maps/search/activity+name+${tripData.destination}"
        }
      ]
    }
  ]
}

Budget guidelines (in Indian Rupees):
- Low budget (₹2000-4000/day): Focus on free/cheap activities, budget hotels, street food, local transport
- Medium budget (₹4000-12000/day): Mix of paid attractions, mid-range hotels, local restaurants, AC transport
- High budget (₹12000+/day): Premium experiences, luxury hotels, fine dining, private transport

Include 4-6 activities per day with realistic timing. Provide specific place names and locations in ${tripData.destination}, India.
Make sure all costs are realistic in Indian Rupees and add up correctly in the estimatedCost section.
Focus on Indian culture, heritage sites, local cuisine, and authentic experiences.

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

  // Ensure all required fields exist
  const enhanced = {
    destination: itinerary.destination || tripData.destination,
    totalDays: itinerary.totalDays || tripData.days,
    estimatedCost: itinerary.estimatedCost || {
      total: calculateBudgetEstimate(tripData.budget, tripData.days),
      accommodation: 0,
      food: 0,
      activities: 0,
      transport: 0,
      currency: "INR"
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
          name: "Morning Heritage Walk",
          description: `Discover the rich heritage and culture of ${tripData.destination}`,
          duration: "3 hours",
          cost: 500,
          type: "activity",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' heritage sites')}`
        }
      ]
    })
  }

  // Recalculate costs if needed
  if (!enhanced.estimatedCost.total || enhanced.estimatedCost.total === 0) {
    const totalCost = enhanced.days.reduce((sum, day) => {
      return sum + day.activities.reduce((daySum, activity) => daySum + (activity.cost || 0), 0)
    }, 0)

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

  const budgetMultiplier = tripData.budget === 'low' ? 0.5 : tripData.budget === 'high' ? 3 : 1
  const dailyBudget = 3000 * budgetMultiplier // Base budget in INR

  return {
    destination: tripData.destination,
    totalDays: tripData.days,
    estimatedCost: {
      total: dailyBudget * tripData.days,
      accommodation: dailyBudget * 0.4 * tripData.days,
      food: dailyBudget * 0.3 * tripData.days,
      activities: dailyBudget * 0.2 * tripData.days,
      transport: dailyBudget * 0.1 * tripData.days,
      currency: "INR"
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
          name: "Morning Heritage Tour",
          description: `Start your day exploring the cultural heritage of ${tripData.destination}`,
          duration: "3 hours",
          cost: 800,
          type: "activity",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' tourist places')}`
        },
        {
          time: "13:00",
          name: "Traditional Indian Lunch",
          description: `Experience authentic ${tripData.destination} cuisine`,
          duration: "1 hour",
          cost: 400,
          type: "restaurant",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' restaurants')}`
        },
        {
          time: "15:00",
          name: "Cultural Heritage Site",
          description: `Immerse yourself in the rich history and culture of ${tripData.destination}`,
          duration: "2 hours",
          cost: 300,
          type: "attraction",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' heritage sites')}`
        }
      ]
    }))
  }
}

const calculateBudgetEstimate = (budget, days) => {
  const multipliers = { low: 2500, medium: 6000, high: 15000 } // INR per day
  return (multipliers[budget] || 6000) * days
}

const calculateCarbonFootprint = (destination, days) => {
  // Simple calculation based on destination and duration
  const baseFootprint = 35 // kg CO2 per day (lower for domestic travel in India)
  const destinationMultiplier = getDestinationCarbonMultiplier(destination)
  return Math.round(baseFootprint * days * destinationMultiplier)
}

const getDestinationCarbonMultiplier = (destination) => {
  // Simple multiplier based on typical travel distance and local transport
  // Lower multiplier for domestic Indian travel
  return 0.8 // Default multiplier for India
}

module.exports = {
  generateItinerary
}