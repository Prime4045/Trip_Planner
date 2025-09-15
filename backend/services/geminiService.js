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

    // Calculate proper budget based on travel type and member count
    const memberCount = tripData.memberCount || 1
    const baseBudgetPerPerson = {
      low: 2000,
      medium: 5000, 
      high: 12000
    }
    const dailyBudgetTotal = baseBudgetPerPerson[tripData.budget] * memberCount
    const prompt = `
Create a detailed ${tripData.days}-day travel itinerary for ${tripData.destination}.

Trip Details:
- Budget: ${tripData.budget}
- Days: ${tripData.days}
- Travel Type: ${tripData.travelType}
- Number of People: ${memberCount}
- Daily Budget: ₹${dailyBudgetTotal} total for ${memberCount} people
- Preferences: ${tripData.preferences.join(', ')}

Please provide a JSON response with this exact structure:
{
  "destination": "${tripData.destination}",
  "totalDays": ${tripData.days},
  "memberCount": ${memberCount},
  "travelType": "${tripData.travelType}",
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
          "location": "Specific address or area",
          "googleMapsUrl": "https://www.google.com/maps/search/activity+name+${tripData.destination}"
        }
      ]
    }
  ]
}

Budget guidelines for ${memberCount} people (Total ₹${dailyBudgetTotal}/day):
- Low budget: Focus on free/cheap activities, budget accommodations, local food, public transport
- Medium budget: Mix of paid attractions, mid-range accommodations, good restaurants, comfortable transport  
- High budget: Premium experiences, luxury accommodations, fine dining, private transport

Travel Type Considerations:
- ${tripData.travelType === 'solo' ? 'Solo travel: Focus on safe, accessible activities and social opportunities' : ''}
- ${tripData.travelType === 'couple' ? 'Couple travel: Include romantic experiences, intimate dining, and couple activities' : ''}
- ${tripData.travelType === 'friends' ? 'Friends travel: Include group activities, nightlife, adventure sports, and social experiences' : ''}
- ${tripData.travelType === 'family' ? 'Family travel: Include family-friendly activities, safe accommodations, and activities suitable for all ages' : ''}

Include 4-6 activities per day with realistic timing. Provide specific place names and locations in ${tripData.destination}.
Make sure all costs are realistic and add up correctly in the estimatedCost section for ${memberCount} people.
Consider group dynamics and ensure activities are suitable for ${tripData.travelType} travel.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean and parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log('AI response format invalid, using fallback')
      return generateFallbackItinerary(tripData)
    }
    
    let itinerary
    try {
      itinerary = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.log('JSON parse failed, using fallback')
      return generateFallbackItinerary(tripData)
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
  const memberCount = tripData.memberCount || 1
  const baseBudgetPerPerson = {
    low: 2000,
    medium: 5000,
    high: 12000
  }
  const dailyBudgetTotal = baseBudgetPerPerson[tripData.budget] * memberCount

  // Ensure all required fields exist
  const enhanced = {
    destination: itinerary.destination || tripData.destination,
    totalDays: itinerary.totalDays || tripData.days,
    memberCount: itinerary.memberCount || memberCount,
    travelType: itinerary.travelType || tripData.travelType,
    estimatedCost: itinerary.estimatedCost || {
      total: dailyBudgetTotal * tripData.days,
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
    const defaultActivityCost = Math.round(dailyBudgetTotal * 0.3 / 3) // 30% of daily budget divided by 3 activities
    enhanced.days.push({
      day: enhanced.days.length + 1,
      title: `Day ${enhanced.days.length + 1} - Explore ${tripData.destination}`,
      activities: [
        {
          time: "09:00",
          name: "Morning Exploration",
          description: `Discover the attractions and culture of ${tripData.destination}`,
          duration: "3 hours",
          cost: defaultActivityCost,
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
    
    const properTotal = dailyBudgetTotal * tripData.days
    enhanced.estimatedCost.total = properTotal
    enhanced.estimatedCost.accommodation = Math.round(properTotal * 0.4)
    enhanced.estimatedCost.food = Math.round(properTotal * 0.3)
    enhanced.estimatedCost.activities = Math.round(properTotal * 0.2)
    enhanced.estimatedCost.transport = Math.round(properTotal * 0.1)
  }

  return enhanced
}

const generateFallbackItinerary = (tripData) => {
  const memberCount = tripData.memberCount || 1
  const baseBudgetPerPerson = {
    low: 2000,
    medium: 5000,
    high: 12000
  }
  const dailyBudgetTotal = baseBudgetPerPerson[tripData.budget] * memberCount

  return {
    destination: tripData.destination,
    totalDays: tripData.days,
    memberCount: memberCount,
    travelType: tripData.travelType,
    estimatedCost: {
      total: dailyBudgetTotal * tripData.days,
      accommodation: Math.round(dailyBudgetTotal * 0.4 * tripData.days),
      food: Math.round(dailyBudgetTotal * 0.3 * tripData.days),
      activities: Math.round(dailyBudgetTotal * 0.2 * tripData.days),
      transport: Math.round(dailyBudgetTotal * 0.1 * tripData.days),
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
          name: "Morning Exploration",
          description: `Start your day exploring ${tripData.destination}`,
          duration: "3 hours",
          cost: Math.round(dailyBudgetTotal * 0.15), // 15% of daily budget
          type: "activity",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' tourist places')}`
        },
        {
          time: "13:00",
          name: "Local Lunch",
          description: `Experience local cuisine in ${tripData.destination}`,
          duration: "1 hour",
          cost: Math.round(dailyBudgetTotal * 0.1), // 10% of daily budget
          type: "restaurant",
          location: tripData.destination,
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(tripData.destination + ' restaurants')}`
        },
        {
          time: "15:00",
          name: "Afternoon Activity",
          description: `Explore attractions and activities in ${tripData.destination}`,
          duration: "2 hours",
          cost: Math.round(dailyBudgetTotal * 0.12), // 12% of daily budget
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
  const baseFootprint = 35 // kg CO2 per day
  const destinationMultiplier = getDestinationCarbonMultiplier(destination)
  return Math.round(baseFootprint * days * destinationMultiplier)
}

const getDestinationCarbonMultiplier = (destination) => {
  // Simple multiplier based on typical travel distance and local transport
  return 0.8 // Default multiplier
}

module.exports = {
  generateItinerary
}