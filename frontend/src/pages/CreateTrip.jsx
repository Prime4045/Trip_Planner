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
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
  Eye,
  CheckCircle2
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [generatedRecommendations, setGeneratedRecommendations] = useState([])
  const [selectedRecommendations, setSelectedRecommendations] = useState([])
  
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
    { id: 1, title: 'Destination', icon: MapPin, description: 'Where to?' },
    { id: 2, title: 'Dates', icon: Calendar, description: 'When?' },
    { id: 3, title: 'Trip Type', icon: Users, description: 'Who?' },
    { id: 4, title: 'Interests', icon: Heart, description: 'What?' },
    { id: 5, title: 'AI Planning', icon: Sparkles, description: 'Generate' },
    { id: 6, title: 'Review', icon: CheckCircle2, description: 'Customize' }
  ]

  const popularDestinations = [
    {
      name: 'New York City',
      country: 'United States',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      description: 'The city that never sleeps',
      trending: true
    },
    {
      name: 'Rome',
      country: 'Italy', 
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
      description: 'Ancient history meets modern life',
      trending: false
    },
    {
      name: 'Istanbul',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400',
      description: 'Where Europe meets Asia',
      trending: true
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      description: 'Ultra-modern meets traditional',
      trending: false
    },
    {
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
      description: 'The city of light and love',
      trending: true
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      description: 'Tropical paradise',
      trending: false
    }
  ]

  const tripTypes = [
    { 
      id: 'solo', 
      label: 'Solo Trip', 
      icon: User, 
      description: 'Just me, myself and I',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'partner', 
      label: 'Partner Trip', 
      icon: Heart, 
      description: 'Romantic getaway for two',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'friends', 
      label: 'Friends Trip', 
      icon: UserPlus, 
      description: 'Adventure with the squad',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'family', 
      label: 'Family Trip', 
      icon: Users, 
      description: 'Quality time with loved ones',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const interestOptions = [
    { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'culture', label: 'Culture & History', icon: Building, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { id: 'adventure', label: 'Adventure', icon: Mountain, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'nightlife', label: 'Nightlife', icon: Music, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'beaches', label: 'Beaches', icon: Waves, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    { id: 'nature', label: 'Nature', icon: TreePine, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'museums', label: 'Museums', icon: Building, color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { id: 'architecture', label: 'Architecture', icon: Building, color: 'bg-stone-100 text-stone-700 border-stone-200' }
  ]

  // Mock autocomplete function
  const searchDestinations = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    const mockSuggestions = [
      { name: 'Jaipur', country: 'Rajasthan, India', type: 'City' },
      { name: 'Jakarta', country: 'Indonesia', type: 'City' },
      { name: 'Jamaica', country: 'Caribbean', type: 'Country' },
      { name: 'Japan', country: 'Asia', type: 'Country' },
      { name: 'Jordan', country: 'Middle East', type: 'Country' }
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
    setTimeout(() => handleNext(), 300)
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

  const generateRecommendations = async () => {
    // Mock recommendations based on destination
    const mockRecommendations = [
      {
        id: 1,
        name: 'Hawa Mahal',
        type: 'Heritage Site',
        rating: 4.5,
        reviews: 12847,
        image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=400',
        description: 'Palace of Winds - iconic pink sandstone palace with intricate latticework',
        price: '₹200',
        duration: '2 hours',
        selected: true
      },
      {
        id: 2,
        name: 'City Palace',
        type: 'Palace',
        rating: 4.6,
        reviews: 8934,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        description: 'Royal residence with museums, courtyards and stunning architecture',
        price: '₹500',
        duration: '3 hours',
        selected: true
      },
      {
        id: 3,
        name: 'Amber Fort',
        type: 'Fort',
        rating: 4.7,
        reviews: 15632,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
        description: 'Magnificent hilltop fort with elephant rides and mirror palace',
        price: '₹550',
        duration: '4 hours',
        selected: true
      },
      {
        id: 4,
        name: 'Jantar Mantar',
        type: 'Observatory',
        rating: 4.2,
        reviews: 5421,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        description: 'UNESCO World Heritage astronomical observatory with giant instruments',
        price: '₹200',
        duration: '1.5 hours',
        selected: false
      },
      {
        id: 5,
        name: 'Nahargarh Fort',
        type: 'Fort',
        rating: 4.4,
        reviews: 7234,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
        description: 'Sunset point fort with panoramic city views and royal history',
        price: '₹200',
        duration: '2 hours',
        selected: false
      }
    ]
    
    setGeneratedRecommendations(mockRecommendations)
    setSelectedRecommendations(mockRecommendations.filter(r => r.selected).map(r => r.id))
  }

  const toggleRecommendation = (id) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(recId => recId !== id)
        : [...prev, id]
    )
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
        days: formData.flexibleDates ? 5 : days,
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
      case 6: return selectedRecommendations.length > 0
      default: return true
    }
  }

  const renderCalendar = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()
    const today = new Date()
    
    const days = []
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day)
      const dateString = date.toISOString().split('T')[0]
      const isSelected = formData.startDate === dateString || formData.endDate === dateString
      const isInRange = formData.startDate && formData.endDate && 
        date >= new Date(formData.startDate) && date <= new Date(formData.endDate)
      const isPast = date < today
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(dateString)}
          disabled={isPast}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
            isSelected 
              ? 'bg-blue-600 text-white shadow-lg' 
              : isInRange
              ? 'bg-blue-100 text-blue-700'
              : isPast
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      )
    }
    
    return days
  }

  const handleDateSelect = (dateString) => {
    if (!formData.startDate || (formData.startDate && formData.endDate)) {
      // Set start date
      setFormData(prev => ({ ...prev, startDate: dateString, endDate: '' }))
    } else {
      // Set end date
      const startDate = new Date(formData.startDate)
      const endDate = new Date(dateString)
      
      if (endDate > startDate) {
        setFormData(prev => ({ ...prev, endDate: dateString }))
      } else {
        setFormData(prev => ({ ...prev, startDate: dateString, endDate: '' }))
      }
    }
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                First, where do you want to go?
              </h2>
              <p className="text-lg text-gray-600">
                You'll get custom recommendations you can save and turn into an itinerary.
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <Input
                  placeholder="Choose a city or town"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 h-16 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                />
              </div>

              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-10 max-h-60 overflow-y-auto shadow-xl border-0">
                  <CardContent className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleDestinationSelect(suggestion)}
                        className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl text-left transition-colors"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{suggestion.name}</div>
                          <div className="text-sm text-gray-500">{suggestion.country}</div>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {suggestion.type}
                        </Badge>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Popular Destinations */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                Or get started with a popular destination
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {popularDestinations.map((dest, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Card 
                      className="cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleDestinationSelect(dest.name)}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {dest.trending && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                            Trending
                          </Badge>
                        )}
                        <div className="absolute bottom-4 left-4 text-white">
                          <h4 className="font-bold text-lg">{dest.name}</h4>
                          <p className="text-sm opacity-90">{dest.country}</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">{dest.description}</p>
                      </CardContent>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                When are you going?
              </h2>
              <p className="text-lg text-gray-600">
                Choose a date range, up to 30 days.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {!formData.flexibleDates ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                      <Button
                        variant="ghost"
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      
                      <h3 className="text-xl font-semibold text-gray-900">
                        {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </h3>
                      
                      <Button
                        variant="ghost"
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                      {renderCalendar()}
                    </div>

                    {/* Selected Dates Display */}
                    {(formData.startDate || formData.endDate) && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Departure:</span>
                            <span className="font-semibold text-blue-700">
                              {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Select date'}
                            </span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Return:</span>
                            <span className="font-semibold text-blue-700">
                              {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Select date'}
                            </span>
                          </div>
                          {formData.startDate && formData.endDate && (
                            <>
                              <div className="w-8 h-px bg-gray-300"></div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold text-green-700">{calculateDays()} days</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Flexible Dates Selected
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We'll create a 5-day itinerary that you can adjust later based on your schedule.
                    </p>
                    <Button
                      onClick={() => setFormData(prev => ({ ...prev, flexibleDates: false }))}
                      variant="outline"
                    >
                      Choose Specific Dates Instead
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Flexible Dates Option */}
              <div className="text-center mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    flexibleDates: !prev.flexibleDates,
                    startDate: '',
                    endDate: ''
                  }))}
                  className="text-blue-600 hover:text-blue-700 underline text-lg"
                >
                  {formData.flexibleDates ? "I know my dates" : "I don't know my dates yet"}
                </Button>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What kind of trip are you planning?
              </h2>
              <p className="text-lg text-gray-600">
                Select one.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Trip Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {tripTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 border-2 ${
                        formData.tripType === type.id 
                          ? 'border-blue-500 shadow-xl bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, tripType: type.id }))}
                    >
                      <CardContent className="p-8 text-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-4`}>
                          <type.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.label}</h3>
                        <p className="text-gray-600">{type.description}</p>
                        {formData.tripType === type.id && (
                          <div className="mt-4">
                            <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Options */}
              <div className="space-y-8">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Are you travelling with children?
                      </h3>
                      <p className="text-gray-600">This helps us recommend family-friendly activities</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant={formData.withChildren ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, withChildren: true }))}
                        className="px-12 py-6 text-lg rounded-2xl"
                      >
                        <Baby className="mr-3 h-5 w-5" />
                        Yes
                      </Button>
                      <Button
                        variant={!formData.withChildren ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, withChildren: false }))}
                        className="px-12 py-6 text-lg rounded-2xl"
                      >
                        No
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Are you travelling with pets?
                      </h3>
                      <p className="text-gray-600">We'll find pet-friendly accommodations and activities</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant={formData.withPets ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, withPets: true }))}
                        className="px-12 py-6 text-lg rounded-2xl"
                      >
                        <PawPrint className="mr-3 h-5 w-5" />
                        Yes
                      </Button>
                      <Button
                        variant={!formData.withPets ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, withPets: false }))}
                        className="px-12 py-6 text-lg rounded-2xl"
                      >
                        No
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What are you interested in?
              </h2>
              <p className="text-lg text-gray-600">
                Select all that apply. We'll use these to personalize your trip.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Interest Tags */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInterestToggle(interest.label)}
                    className={`p-6 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ${
                      formData.interests.includes(interest.label)
                        ? `border-blue-500 ${interest.color} shadow-lg`
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <interest.icon className="h-6 w-6 mx-auto mb-3" />
                    <div>{interest.label}</div>
                    {formData.interests.includes(interest.label) && (
                      <CheckCircle2 className="h-5 w-5 mx-auto mt-2 text-blue-600" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Custom Interest Input */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label className="text-sm text-gray-600 mb-2 block">Add custom interest</Label>
                      <Input
                        placeholder="e.g., Wine tasting, Hiking, Local markets"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={addCustomInterest} 
                      className="mt-6 rounded-xl"
                      disabled={!customInterest.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Interests */}
              {formData.interests.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Selected Interests ({formData.interests.length})
                      </h4>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {formData.interests.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-white text-blue-700 px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 border border-blue-200 rounded-full"
                          onClick={() => removeInterest(interest)}
                        >
                          {interest}
                          <X className="ml-2 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Final Details
              </h2>
              <p className="text-lg text-gray-600">
                Just a few more details to create your perfect itinerary.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* From Location */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <Label htmlFor="fromLocation" className="text-lg font-medium text-gray-900 mb-4 block">
                    <Navigation className="inline mr-3 h-5 w-5" />
                    Starting from (Your current city) *
                  </Label>
                  <Input
                    id="fromLocation"
                    placeholder="e.g., Mumbai, Delhi, Your City"
                    value={formData.fromLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
                    className="h-14 text-lg rounded-xl border-2"
                  />
                </CardContent>
              </Card>

              {/* Total Budget */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <Label htmlFor="totalBudget" className="text-lg font-medium text-gray-900 mb-4 block">
                    <DollarSign className="inline mr-3 h-5 w-5" />
                    Total Trip Budget ({getCurrencySymbol()}) *
                  </Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    placeholder={`Enter your total budget in ${getCurrencySymbol()}`}
                    value={formData.totalBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                    className="h-14 text-lg rounded-xl border-2"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This will be distributed across accommodation, food, activities, and transport
                  </p>
                </CardContent>
              </Card>

              {/* Trip Summary */}
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Trip Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">{formData.fromLocation || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">{formData.destination}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {formData.flexibleDates ? '5 days (flexible)' : `${calculateDays()} days`}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Trip Type:</span>
                      <span className="font-medium capitalize">{formData.tripType}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(formData.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Interests:</span>
                      <span className="font-medium">{formData.interests.length} selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  generateRecommendations()
                  handleNext()
                }}
                disabled={!canProceed()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-16 text-lg rounded-2xl shadow-lg"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Generate AI Recommendations
              </Button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            {/* Loading State */}
            {generating ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8"
                >
                  <Sparkles className="h-12 w-12 text-white" />
                </motion.div>
                
                <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      Generating recommendations
                    </h3>
                    <p className="text-purple-100 mb-6">
                      We're whipping up all your recommendations in one place.
                    </p>
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-8">
                  <p className="text-gray-600 mb-2">Review our recommendations for your trip</p>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{formData.destination}</h2>
                  <p className="text-lg text-gray-600">
                    {formData.tripType} • {formData.flexibleDates ? 'Flexible dates' : `${calculateDays()} days`}
                  </p>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Recommendations */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Heritage and Wildlife: A Journey Through {formData.destination}'s Treasures
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Explore the rich tapestry of heritage at historic sites and discover unique finds, 
                        each offering a delightful blend of history and adventure.
                      </p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Select all</span>
                          <button
                            onClick={() => {
                              const allIds = generatedRecommendations.map(r => r.id)
                              setSelectedRecommendations(
                                selectedRecommendations.length === allIds.length ? [] : allIds
                              )
                            }}
                            className="w-6 h-6 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-white" />
                          </button>
                          <span className="text-sm text-gray-600">
                            ({selectedRecommendations.length}/{generatedRecommendations.length} selected)
                          </span>
                        </div>
                        <Button
                          onClick={() => {
                            const allIds = generatedRecommendations.map(r => r.id)
                            setSelectedRecommendations(
                              selectedRecommendations.length === allIds.length ? [] : allIds
                            )
                          }}
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          {selectedRecommendations.length === generatedRecommendations.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {generatedRecommendations.map((place) => (
                          <Card key={place.id} className="shadow-lg border-0 overflow-hidden">
                            <div className="flex">
                              <div className="w-32 h-32 relative">
                                <img
                                  src={place.image}
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => toggleRecommendation(place.id)}
                                  className={`absolute top-2 right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                    selectedRecommendations.includes(place.id)
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-white border-gray-300 hover:border-green-500'
                                  }`}
                                >
                                  {selectedRecommendations.includes(place.id) && (
                                    <Check className="h-4 w-4 text-white" />
                                  )}
                                </button>
                              </div>
                              
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold text-gray-900">{place.name}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="font-medium">{place.rating}</span>
                                      <span>({place.reviews.toLocaleString()})</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {place.type}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {place.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {place.price}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {place.duration}
                                    </span>
                                  </div>
                                  {selectedRecommendations.includes(place.id) && (
                                    <button
                                      onClick={() => toggleRecommendation(place.id)}
                                      className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                      Remove from Trip
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Map */}
                  <div className="lg:sticky lg:top-8">
                    <Card className="shadow-xl border-0 overflow-hidden">
                      <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
                            <p className="text-gray-500">
                              Map with pins for selected places would appear here
                            </p>
                            <div className="mt-4 flex justify-center space-x-2">
                              {selectedRecommendations.slice(0, 5).map((id, index) => (
                                <div
                                  key={id}
                                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                                >
                                  {index + 1}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Save Trip Button */}
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedRecommendations.length === 0}
                      className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-14 text-lg rounded-2xl shadow-lg"
                    >
                      <CheckCircle2 className="mr-3 h-6 w-6" />
                      Save Trip & Go to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Initialize recommendations when reaching step 6
  useEffect(() => {
    if (currentStep === 6 && generatedRecommendations.length === 0) {
      generateRecommendations()
    }
  }, [currentStep])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Progress Bar */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep >= step.id ? 1 : 0.8 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : currentStep === step.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </motion.div>
                  <div className="mt-2 text-center">
                    <span className={`text-sm font-semibold ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    <p className={`text-xs ${
                      currentStep >= step.id ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded-full transition-all duration-500 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between max-w-2xl mx-auto mt-12"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center px-8 py-3 rounded-2xl"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center px-8 py-3 rounded-2xl shadow-lg"
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CreateTrip