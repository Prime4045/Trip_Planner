import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrip } from '../context/TripContext'
import { useCurrency } from '../context/CurrencyContext'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Plane,
  Loader2,
  Sparkles,
  Navigation,
  Search,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Heart,
  UserPlus,
  Baby,
  PawPrint,
  Camera,
  Utensils,
  ShoppingBag,
  Mountain,
  Building,
  Music,
  Waves,
  TreePine,
  Star,
  Plus,
  X
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'

const CreateTrip = () => {
  const navigate = useNavigate()
  const { createTrip, generating } = useTrip()
  const { formatCurrency, getCurrencySymbol } = useCurrency()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [customInterest, setCustomInterest] = useState('')
  
  const [formData, setFormData] = useState({
    fromLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    tripType: '',
    withChildren: false,
    withPets: false,
    interests: [],
    flexibleDates: false
  })

  const steps = [
    { id: 1, title: 'Destination', icon: MapPin },
    { id: 2, title: 'Dates', icon: Calendar },
    { id: 3, title: 'Trip Type', icon: Users },
    { id: 4, title: 'Interests', icon: Heart },
    { id: 5, title: 'AI Planning', icon: Sparkles },
    { id: 6, title: 'Review', icon: Check }
  ]

  const popularDestinations = [
    {
      name: 'New York City',
      country: 'United States',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300',
      description: 'The city that never sleeps'
    },
    {
      name: 'Rome',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300',
      description: 'Ancient history meets modern life'
    },
    {
      name: 'Istanbul',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300',
      description: 'Where Europe meets Asia'
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300',
      description: 'Ultra-modern meets traditional'
    },
    {
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300',
      description: 'The city of light and love'
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300',
      description: 'Tropical paradise'
    }
  ]

  const tripTypes = [
    { id: 'solo', label: 'Solo Trip', icon: User, description: 'Just me, myself and I' },
    { id: 'partner', label: 'Partner Trip', icon: Heart, description: 'Romantic getaway for two' },
    { id: 'friends', label: 'Friends Trip', icon: UserPlus, description: 'Adventure with the squad' },
    { id: 'family', label: 'Family Trip', icon: Users, description: 'Quality time with loved ones' }
  ]

  const interestOptions = [
    { id: 'food', label: 'Food & Cuisine', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
    { id: 'culture', label: 'Culture & History', icon: Building, color: 'bg-purple-100 text-purple-700' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700' },
    { id: 'adventure', label: 'Adventure', icon: Mountain, color: 'bg-green-100 text-green-700' },
    { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-blue-100 text-blue-700' },
    { id: 'nightlife', label: 'Nightlife', icon: Music, color: 'bg-indigo-100 text-indigo-700' },
    { id: 'beaches', label: 'Beaches', icon: Waves, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'nature', label: 'Nature', icon: TreePine, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'museums', label: 'Museums', icon: Building, color: 'bg-gray-100 text-gray-700' },
    { id: 'architecture', label: 'Architecture', icon: Building, color: 'bg-stone-100 text-stone-700' }
  ]

  // Mock autocomplete function - replace with actual API call
  const searchDestinations = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    // Mock suggestions - in real app, call your backend API
    const mockSuggestions = [
      { name: 'Jaipur', country: 'Rajasthan, India' },
      { name: 'Jakarta', country: 'Indonesia' },
      { name: 'Jamaica', country: 'Caribbean' },
      { name: 'Japan', country: 'Asia' }
    ].filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.country.toLowerCase().includes(query.toLowerCase())
    )

    setSuggestions(mockSuggestions)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchDestinations(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    }
    return 1
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDestinationSelect = (destination) => {
    setFormData(prev => ({ 
      ...prev, 
      destination: typeof destination === 'string' ? destination : destination.name 
    }))
    setSearchQuery('')
    setSuggestions([])
    handleNext()
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }))
      setCustomInterest('')
    }
  }

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.fromLocation || !formData.destination || !formData.totalBudget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (formData.interests.length === 0) {
      toast({
        title: "Select Interests",
        description: "Please select at least one interest.",
        variant: "destructive"
      })
      return
    }

    const days = calculateDays()
    if (days <= 0 && !formData.flexibleDates) {
      toast({
        title: "Invalid Dates",
        description: "Return date must be after start date.",
        variant: "destructive"
      })
      return
    }

    try {
      const trip = await createTrip({
        fromLocation: formData.fromLocation,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: formData.flexibleDates ? 5 : days, // Default 5 days for flexible dates
        totalBudget: parseInt(formData.totalBudget),
        preferences: formData.interests,
        tripType: formData.tripType,
        withChildren: formData.withChildren,
        withPets: formData.withPets,
        flexibleDates: formData.flexibleDates
      })
      
      toast({
        title: "Trip Created!",
        description: "Your AI-powered itinerary is ready.",
      })
      
      navigate(`/trip/${trip._id || trip.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive"
      })
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.destination
      case 2: return formData.flexibleDates || (formData.startDate && formData.endDate)
      case 3: return formData.tripType
      case 4: return formData.interests.length > 0
      case 5: return formData.fromLocation && formData.totalBudget
      default: return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                First, where do you want to go?
              </h2>
              <p className="text-gray-600">
                You'll get custom recommendations you can save and turn into an itinerary.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Choose a city or town"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-10 max-h-60 overflow-y-auto">
                  <CardContent className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleDestinationSelect(suggestion)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.name}</div>
                          <div className="text-sm text-gray-500">{suggestion.country}</div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Popular Destinations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Or get started with a popular destination
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularDestinations.map((dest, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer card-hover overflow-hidden"
                      onClick={() => handleDestinationSelect(dest.name)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                When are you going?
              </h2>
              <p className="text-gray-600">
                Choose a date range, up to 30 days.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Departure Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={formData.flexibleDates}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Return Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    disabled={formData.flexibleDates}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Trip Duration Display */}
              {formData.startDate && formData.endDate && !formData.flexibleDates && (
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-blue-700 font-medium">
                    Trip Duration: {calculateDays()} days
                  </p>
                </div>
              )}

              {/* Flexible Dates Option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    flexibleDates: !prev.flexibleDates,
                    startDate: '',
                    endDate: ''
                  }))}
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  {formData.flexibleDates ? "I know my dates" : "I don't know my dates yet"}
                </button>
              </div>

              {formData.flexibleDates && (
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Flexible Dates Selected
                  </h3>
                  <p className="text-gray-600">
                    We'll create a 5-day itinerary that you can adjust later based on your schedule.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What kind of trip are you planning?
              </h2>
              <p className="text-gray-600">
                Select one.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Trip Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {tripTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        formData.tripType === type.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, tripType: type.id }))}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3">
                          <type.icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        {formData.tripType === type.id && (
                          <div className="mt-3">
                            <Check className="h-5 w-5 text-blue-600 mx-auto" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Options */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Are you travelling with children?
                  </h3>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={formData.withChildren ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, withChildren: true }))}
                      className="px-8"
                    >
                      <Baby className="mr-2 h-4 w-4" />
                      Yes
                    </Button>
                    <Button
                      variant={!formData.withChildren ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, withChildren: false }))}
                      className="px-8"
                    >
                      No
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Are you travelling with pets?
                  </h3>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={formData.withPets ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, withPets: true }))}
                      className="px-8"
                    >
                      <PawPrint className="mr-2 h-4 w-4" />
                      Yes
                    </Button>
                    <Button
                      variant={!formData.withPets ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, withPets: false }))}
                      className="px-8"
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What are you interested in?
              </h2>
              <p className="text-gray-600">
                Select all that apply. We'll use these to personalize your trip.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Interest Tags */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInterestToggle(interest.label)}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.interests.includes(interest.label)
                        ? `border-blue-500 ${interest.color}`
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <interest.icon className="h-5 w-5 mx-auto mb-2" />
                    {interest.label}
                  </motion.button>
                ))}
              </div>

              {/* Custom Interest Input */}
              <div className="max-w-md mx-auto">
                <Label className="text-sm text-gray-600 mb-2 block">Add custom interest</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="e.g., Wine tasting, Hiking"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                  />
                  <Button onClick={addCustomInterest} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Selected Interests */}
              {formData.interests.length > 0 && (
                <div className="mt-6">
                  <Label className="text-sm text-gray-600 mb-3 block text-center">
                    Selected interests ({formData.interests.length})
                  </Label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {formData.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 px-3 py-1 cursor-pointer hover:bg-blue-200"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest}
                        <X className="ml-2 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Final Details
              </h2>
              <p className="text-gray-600">
                Just a few more details to create your perfect itinerary.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* From Location */}
              <div className="space-y-2">
                <Label htmlFor="fromLocation">
                  <Navigation className="inline mr-2 h-4 w-4" />
                  Starting from (Your current city) *
                </Label>
                <Input
                  id="fromLocation"
                  placeholder="e.g., Mumbai, Delhi, Your City"
                  value={formData.fromLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
                  className="h-12 text-lg"
                />
              </div>

              {/* Total Budget */}
              <div className="space-y-2">
                <Label htmlFor="totalBudget">
                  <DollarSign className="inline mr-2 h-4 w-4" />
                  Total Trip Budget ({getCurrencySymbol()}) *
                </Label>
                <Input
                  id="totalBudget"
                  type="number"
                  placeholder={`Enter your total budget in ${getCurrencySymbol()}`}
                  value={formData.totalBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                  className="h-12 text-lg"
                  min="1"
                />
                <p className="text-sm text-gray-500">
                  This will be distributed across accommodation, food, activities, and transport
                </p>
              </div>

              {/* Trip Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Trip Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">{formData.fromLocation || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">{formData.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {formData.flexibleDates ? '5 days (flexible)' : `${calculateDays()} days`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trip Type:</span>
                      <span className="font-medium capitalize">{formData.tripType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(formData.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interests:</span>
                      <span className="font-medium">{formData.interests.length} selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSubmit}
                disabled={generating || !canProceed()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Perfect Trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Itinerary
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Generating Your Perfect Trip...
              </h2>
              <p className="text-gray-600">
                Our AI is creating a personalized itinerary just for you
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">Analyzing your preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">Finding best places to visit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                  <span className="text-gray-700">Creating day-by-day schedule</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-gray-500">Calculating costs & timings</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 transition-all ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between max-w-2xl mx-auto"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CreateTrip