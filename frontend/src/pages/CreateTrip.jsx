import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrip } from '../context/TripContext'
import { useCurrency } from '../context/CurrencyContext'
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  Heart,
  Star,
  Clock,
  DollarSign,
  Check,
  X,
  Loader2,
  Sparkles,
  Navigation,
  Camera,
  Save
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'

const CreateTrip = () => {
  const navigate = useNavigate()
  const { createTrip, generating } = useTrip()
  const { formatCurrency } = useCurrency()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    days: 0,
    tripType: '',
    withChildren: false,
    withPets: false,
    interests: [],
    totalBudget: ''
  })
  const [generatedTrip, setGeneratedTrip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [customInterest, setCustomInterest] = useState('')

  const steps = [
    { id: 1, title: 'Destination', description: 'Where to go?' },
    { id: 2, title: 'Dates', description: 'When to travel?' },
    { id: 3, title: 'Trip Type', description: 'Who\'s traveling?' },
    { id: 4, title: 'Interests', description: 'What do you like?' },
    { id: 5, title: 'AI Planning', description: 'Generating trip...' },
    { id: 6, title: 'Your Trip', description: 'Review & customize' }
  ]

  const popularDestinations = [
    { name: 'New York City', country: 'United States', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
    { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
    { name: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400' },
    { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400' },
    { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
    { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' }
  ]

  const tripTypes = [
    { id: 'solo', title: 'Solo Trip', icon: '👤', description: 'Just me' },
    { id: 'partner', title: 'Partner Trip', icon: '💑', description: 'Me and my partner' },
    { id: 'friends', title: 'Friends Trip', icon: '👥', description: 'With friends' },
    { id: 'family', title: 'Family Trip', icon: '👨‍👩‍👧‍👦', description: 'Family vacation' }
  ]

  const availableInterests = [
    { id: 'food', title: 'Food & Cuisine', icon: '🍽️', color: 'bg-orange-100 text-orange-700' },
    { id: 'culture', title: 'Culture & History', icon: '🏛️', color: 'bg-purple-100 text-purple-700' },
    { id: 'adventure', title: 'Adventure', icon: '🏔️', color: 'bg-green-100 text-green-700' },
    { id: 'shopping', title: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-700' },
    { id: 'nightlife', title: 'Nightlife', icon: '🌃', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'nature', title: 'Nature & Parks', icon: '🌳', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'art', title: 'Art & Museums', icon: '🎨', color: 'bg-blue-100 text-blue-700' },
    { id: 'photography', title: 'Photography', icon: '📸', color: 'bg-yellow-100 text-yellow-700' }
  ]

  // Auto-complete for destinations
  const handleDestinationSearch = async (query) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSuggestions(data.slice(0, 5))
      } catch (error) {
        console.error('Autocomplete error:', error)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const selectDestination = (destination) => {
    setTripData(prev => ({ ...prev, destination }))
    setSearchQuery(destination)
    setSuggestions([])
    setCurrentStep(2)
  }

  const calculateDays = (start, end) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate - startDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleDateChange = (field, value) => {
    const newTripData = { ...tripData, [field]: value }
    if (field === 'startDate' || field === 'endDate') {
      newTripData.days = calculateDays(newTripData.startDate, newTripData.endDate)
    }
    setTripData(newTripData)
  }

  const toggleInterest = (interestId) => {
    setTripData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !tripData.interests.includes(customInterest.trim())) {
      setTripData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }))
      setCustomInterest('')
    }
  }

  const generateTrip = async () => {
    setCurrentStep(5)
    try {
      const tripPayload = {
        fromLocation: 'Current Location', // You can make this dynamic
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        days: tripData.days,
        totalBudget: parseInt(tripData.totalBudget),
        preferences: tripData.interests,
        tripType: tripData.tripType,
        withChildren: tripData.withChildren,
        withPets: tripData.withPets
      }

      const result = await createTrip(tripPayload)
      setGeneratedTrip(result)
      setCurrentStep(6)
    } catch (error) {
      console.error('Trip generation failed:', error)
      // Handle error - maybe show error message and go back
    }
  }

  const saveTrip = () => {
    navigate('/dashboard')
  }

  const nextStep = () => {
    if (currentStep === 4) {
      generateTrip()
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return tripData.destination
      case 2: return tripData.startDate && tripData.endDate && tripData.days > 0
      case 3: return tripData.tripType && tripData.totalBudget
      case 4: return tripData.interests.length > 0
      default: return true
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'restaurant': return '🍽️'
      case 'hotel': return '🏨'
      case 'attraction': return '🎯'
      case 'activity': return '🎪'
      case 'transport': return '🚗'
      case 'shopping': return '🛍️'
      case 'nature': return '🌿'
      case 'cultural': return '🏛️'
      case 'spiritual': return '🕉️'
      default: return '📍'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${currentStep >= step.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-2 transition-all duration-300
                    ${currentStep > step.id ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Destination Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  First, where do you want to go?
                </h3>
                <p className="text-gray-600">
                  You'll get custom recommendations you can save and turn into an itinerary.
                </p>
              </div>

              <div className="relative max-w-md mx-auto">
                <Input
                  placeholder="Choose a city or town"
                  value={searchQuery}
                  onChange={(e) => handleDestinationSearch(e.target.value)}
                  className="h-14 text-lg pl-12 rounded-full border-2 border-gray-200 focus:border-blue-500"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-10">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectDestination(suggestion.description)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{suggestion.mainText}</div>
                          <div className="text-sm text-gray-500">{suggestion.secondaryText}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 mb-6">
                  Or get started with a popular destination
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {popularDestinations.map((dest, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className="cursor-pointer card-hover overflow-hidden"
                        onClick={() => selectDestination(`${dest.name}, ${dest.country}`)}
                      >
                        <div className="relative h-32">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute bottom-2 left-2 text-white">
                            <div className="font-semibold text-sm">{dest.name}</div>
                            <div className="text-xs opacity-90">{dest.country}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  When are you going?
                </h3>
                <p className="text-gray-600">
                  Choose your travel dates to get the best recommendations.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <Input
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    min={tripData.startDate || new Date().toISOString().split('T')[0]}
                    className="h-12"
                  />
                </div>

                {tripData.days > 0 && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      {tripData.days} day{tripData.days !== 1 ? 's' : ''} trip
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <button className="text-blue-600 hover:text-blue-700 underline">
                    I don't know my dates yet
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Trip Type & Budget */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  What kind of trip are you planning?
                </h3>
                <p className="text-gray-600">
                  Tell us about your travel style and budget.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-4">Select one:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tripTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          tripData.tripType === type.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setTripData(prev => ({ ...prev, tripType: type.id }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-sm">{type.title}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Are you travelling with children?</span>
                    <div className="flex space-x-2">
                      <Button
                        variant={tripData.withChildren ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTripData(prev => ({ ...prev, withChildren: true }))}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={!tripData.withChildren ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTripData(prev => ({ ...prev, withChildren: false }))}
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Are you travelling with pets?</span>
                    <div className="flex space-x-2">
                      <Button
                        variant={tripData.withPets ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTripData(prev => ({ ...prev, withPets: true }))}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={!tripData.withPets ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTripData(prev => ({ ...prev, withPets: false }))}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Budget for the Trip
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your total budget"
                    value={tripData.totalBudget}
                    onChange={(e) => setTripData(prev => ({ ...prev, totalBudget: e.target.value }))}
                    className="h-12"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  What are you interested in?
                </h3>
                <p className="text-gray-600">
                  Select your interests to get personalized recommendations.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableInterests.map((interest) => (
                    <Card
                      key={interest.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        tripData.interests.includes(interest.id)
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{interest.icon}</div>
                        <div className="font-medium text-sm">{interest.title}</div>
                        {tripData.interests.includes(interest.id) && (
                          <Check className="h-4 w-4 text-blue-600 mx-auto mt-2" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add custom interest..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                  />
                  <Button onClick={addCustomInterest}>Add</Button>
                </div>

                {tripData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tripData.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{interest}</span>
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => toggleInterest(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: AI Planning */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-12 w-12 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Generating recommendations
                </h3>
                <p className="text-gray-600 mb-8">
                  We're whipping up all your recommendations in one place.
                </p>
                
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-blue-600">Creating your perfect trip...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Generated Trip */}
          {currentStep === 6 && generatedTrip && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Review our recommendations for your trip
                </h3>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xl font-semibold">{generatedTrip.destination}</span>
                </div>
                <p className="text-gray-500">
                  {tripData.tripType} • {generatedTrip.totalDays} days • {formatCurrency(generatedTrip.itinerary?.estimatedCost?.total || tripData.totalBudget)}
                </p>
              </div>

              <div className="space-y-8">
                {generatedTrip.itinerary?.days?.map((day, dayIndex) => (
                  <div key={dayIndex} className="space-y-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {day.day}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">{day.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {day.activities?.map((activity, actIndex) => (
                        <Card key={actIndex} className="card-hover overflow-hidden">
                          <div className="relative h-48">
                            {activity.photos && activity.photos[0] ? (
                              <img
                                src={activity.photos[0]}
                                alt={activity.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <span className="text-4xl">{getActivityIcon(activity.type)}</span>
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-white/90 text-gray-700">
                                {activity.time}
                              </Badge>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {activity.name}
                            </h5>
                            
                            {activity.rating && (
                              <div className="flex items-center space-x-1 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(activity.rating)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {activity.rating}
                                </span>
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {activity.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{activity.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs font-medium text-gray-900">
                                <DollarSign className="h-3 w-3" />
                                <span>{formatCurrency(activity.cost)}</span>
                              </div>
                            </div>
                            
                            {activity.googleMapsUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full mt-3"
                                onClick={() => window.open(activity.googleMapsUrl, '_blank')}
                              >
                                <Navigation className="h-3 w-3 mr-1" />
                                View on Maps
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-8">
                <Button
                  onClick={saveTrip}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Trip to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep !== 5 && currentStep !== 6 && (
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateTrip