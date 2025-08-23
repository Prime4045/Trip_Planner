const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key')

const generateItinerary = async (tripData) => {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      console.log('Using fallback itinerary - Gemini API key not configured')
      return generateFallbackItinerary(tripData)
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Create a detailed ${tripData.days}-day travel itinerary for ${tripData.destination}.

Trip Details:
- Budget: ${tripData.budget}
- Days: ${tripData.days}
- Preferences: ${tripData.preferences.join(', ')}

Please provide a JSON response with this exact structure:
{
  "destination": "${tripData.destination}",
  "totalDays": ${tripData.days},
  "estimatedCost": {
    "total": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0
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
          "cost": 25,
          "type": "attraction",
          "location": "Specific address or area"
        }
      ]
    }
  ]
}

Budget guidelines:
- Low budget ($50-100/day): Focus on free/cheap activities, hostels, street food
- Medium budget ($100-300/day): Mix of paid attractions, mid-range hotels, local restaurants  
- High budget ($300+/day): Premium experiences, luxury hotels, fine dining

Include 4-6 activities per day with realistic timing. Provide specific place names and locations in ${tripData.destination}.
Make sure all costs are realistic and add up correctly in the estimatedCost section.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean and parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log('AI response format invalid, using fallback')
      throw new Error('Invalid AI response format')
    }
    
    let itinerary
    try {
      itinerary = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.log('JSON parse failed, using fallback')
      throw new Error('Failed to parse AI response')
    }
    
    // Validate and enhance the response
    return validateAndEnhanceItinerary(itinerary, tripData)
    
  } catch (error) {
    console.error('Error generating itinerary:', error.message)
    
    // Fallback itinerary
    return generateFallbackItinerary(tripData)
  }
}

const validateAndEnhanceItinerary = (itinerary, tripData) => {
  // Ensure all required fields exist
  const enhanced = {
    destination: itinerary.destination || tripData.destination,
    totalDays: itinerary.totalDays || tripData.days,
    estimatedCost: itinerary.estimatedCost || {
      total: calculateBudgetEstimate(tripData.budget, tripData.days),
      accommodation: 0,
      food: 0,
      activities: 0,
      transport: 0
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
          name: "Morning Exploration",
          description: "Discover local attractions and culture",
          duration: "3 hours",
          cost: 30,
          type: "activity",
          location: tripData.destination
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
  const budgetMultiplier = tripData.budget === 'low' ? 0.5 : tripData.budget === 'high' ? 2 : 1
  const dailyBudget = 100 * budgetMultiplier

  return {
    destination: tripData.destination,
    totalDays: tripData.days,
    estimatedCost: {
      total: dailyBudget * tripData.days,
      accommodation: dailyBudget * 0.4 * tripData.days,
      food: dailyBudget * 0.3 * tripData.days,
      activities: dailyBudget * 0.2 * tripData.days,
      transport: dailyBudget * 0.1 * tripData.days
    },
    carbonFootprint: {
      total: calculateCarbonFootprint(tripData.destination, tripData.days),
      transport: 50 * tripData.days,
      accommodation: 20 * tripData.days
    },
    days: Array.from({ length: tripData.days }, (_, index) => ({
      day: index + 1,
      title: `Day ${index + 1} - Explore ${tripData.destination}`,
      activities: [
        {
          time: "09:00",
          name: "Morning Adventure",
          description: `Start your day exploring the best of ${tripData.destination}`,
          duration: "3 hours",
          cost: 25,
          type: "activity",
          location: tripData.destination
        },
        {
          time: "13:00",
          name: "Local Lunch",
          description: "Experience authentic local cuisine",
          duration: "1 hour",
          cost: 20,
          type: "restaurant",
          location: tripData.destination
        },
        {
          time: "15:00",
          name: "Cultural Experience",
          description: "Immerse yourself in local culture and history",
          duration: "2 hours",
          cost: 15,
          type: "attraction",
          location: tripData.destination
        }
      ]
    }))
  }
}

const calculateBudgetEstimate = (budget, days) => {
  const multipliers = { low: 75, medium: 200, high: 400 }
  return (multipliers[budget] || 200) * days
}

const calculateCarbonFootprint = (destination, days) => {
  // Simple calculation based on destination and duration
  const baseFootprint = 45 // kg CO2 per day
  const destinationMultiplier = getDestinationCarbonMultiplier(destination)
  return Math.round(baseFootprint * days * destinationMultiplier)
}

const getDestinationCarbonMultiplier = (destination) => {
  // Simple multiplier based on typical travel distance and local transport
  // This is a simplified calculation - in reality, you'd use more sophisticated data
  return 1.2 // Default multiplier
}

module.exports = {
  generateItinerary
}