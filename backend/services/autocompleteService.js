const axios = require('axios')

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'eff3a486camsh086d6b63316604dp1dd9dajsn34941bd67005'

// Autocomplete search using the correct RapidAPI endpoint
const autocompleteSearch = async (input) => {
  try {
    console.log('Autocomplete search for:', input)
    
    const options = {
      method: 'GET',
      url: 'https://google-place-autocomplete-and-place-info.p.rapidapi.com/maps/api/place/autocomplete/json',
      params: { input: input },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'google-place-autocomplete-and-place-info.p.rapidapi.com'
      }
    }

    const response = await axios.request(options)
    console.log('Autocomplete API response:', response.data)

    if (response.data && response.data.predictions) {
      return response.data.predictions.map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting?.main_text || prediction.description,
        secondaryText: prediction.structured_formatting?.secondary_text || '',
        types: prediction.types || []
      }))
    }

    return []
  } catch (error) {
    console.error('Autocomplete API error:', error.response?.data || error.message)
    return []
  }
}

module.exports = {
  autocompleteSearch
}