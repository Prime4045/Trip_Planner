import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrip } from '../context/TripContext'
import { useToast } from '../hooks/use-toast'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Plane,
  Loader2,
  Sparkles,
  User,
  Heart,
  UserPlus,
  Baby
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
    Save,
    Plus,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'

const CreateTrip = () => {
  const navigate = useNavigate()
  const { createTrip, generating } = useTrip()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budget: '',
    travelType: '',
    memberCount: 1,
    preferences: []
  })

  const travelTypes = [
    { 
      value: 'solo', 
      label: 'Solo Travel', 
      icon: User, 
      description: 'Just you',
      memberCount: 1,
      budgetMultiplier: 1
    },
    { 
      value: 'couple', 
      label: 'Couple', 
      icon: Heart, 
      description: '2 people',
      memberCount: 2,
      budgetMultiplier: 1.8
    },
    { 
      value: 'friends', 
      label: 'Friends', 
      icon: UserPlus, 
      description: '3-6 people',
      memberCount: 4,
      budgetMultiplier: 3.2,
      allowCustomCount: true,
      minCount: 3,
      maxCount: 8
    },
    { 
      value: 'family', 
      label: 'Family', 
      icon: Baby, 
      description: '2-8 people (adults & children)',
      memberCount: 4,
      budgetMultiplier: 3.5,
      allowCustomCount: true,
      minCount: 2,
      maxCount: 10
    }
  ]

  const getBudgetOptions = () => {
    const selectedTravelType = travelTypes.find(type => type.value === formData.travelType)
    const multiplier = selectedTravelType ? selectedTravelType.budgetMultiplier : 1
    const memberCount = formData.memberCount || selectedTravelType?.memberCount || 1
    
    // Base daily costs per person in INR
    const baseCosts = {
      low: 2000,
      medium: 5000,
      high: 12000
    }
    
    return [
      { 
        value: 'low', 
        label: `Budget-Friendly (₹${(baseCosts.low * memberCount).toLocaleString()}/day total)`, 
        icon: '💰',
        dailyCost: baseCosts.low * memberCount
      },
      { 
        value: 'medium', 
        label: `Mid-Range (₹${(baseCosts.medium * memberCount).toLocaleString()}/day total)`, 
        icon: '💳',
        dailyCost: baseCosts.medium * memberCount
      },
      { 
        value: 'high', 
        label: `Luxury (₹${(baseCosts.high * memberCount).toLocaleString()}/day total)`, 
        icon: '💎',
        dailyCost: baseCosts.high * memberCount
      }
    ]
  }

  const preferenceOptions = [
    'Adventure', 'Cultural Heritage', 'Spiritual', 'Food & Cuisine', 'Nature & Wildlife',
    'History & Monuments', 'Shopping', 'Photography', 'Hill Stations', 'Beaches',
    'Mountains', 'Museums', 'Local Experiences', 'Wellness & Ayurveda', 'Festivals'
  ]

  const handleTravelTypeChange = (value) => {
    const selectedType = travelTypes.find(type => type.value === value)
    setFormData(prev => ({
      ...prev,
      travelType: value,
      memberCount: selectedType?.memberCount || 1,
      budget: '' // Reset budget when travel type changes
    }))
  }

  const handleMemberCountChange = (count) => {
    setFormData(prev => ({
      ...prev,
      memberCount: parseInt(count),
      budget: '' // Reset budget when member count changes
    }))
  }
  const handlePreferenceToggle = (preference) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.destination || !formData.days || !formData.budget || !formData.travelType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including travel type.",
        variant: "destructive"
      })
      return

    const navigate = useNavigate()
    const { createTrip, generating } = useTrip()
    const { formatCurrency } = useCurrency()

    const [currentStep, setCurrentStep] = useState(1)
    const [tripData, setTripData] = useState({
        fromLocation: '',
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
    const [destinationInfo, setDestinationInfo] = useState(null)
    const [loadingDestinationInfo, setLoadingDestinationInfo] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [unknownDates, setUnknownDates] = useState(false)

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
        { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
        { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
        { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' }
    ]

    const tripTypes = [
        { id: 'solo', title: 'Solo Trip', icon: '👤', description: 'Just me' },
        { id: 'partner', title: 'Partner Trip', icon: '💑', description: 'Me and my partner' },
        { id: 'friends', title: 'Friends Trip', icon: '👥', description: 'With friends' },
        { id: 'family', title: 'Family Trip', icon: '👨‍👩‍👧‍👦', description: 'Family vacation' }
    ]

    const defaultInterests = [
        'Food',
        'History',
        'Nature',
        'Shopping',
        'Nightlife'
    ]

    // Shuffle function to randomize interests
    const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1)) // Calculate random index first
                ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]] // Swap using randomIndex
        }
        return shuffled

    }

    // Auto-complete for destinations using RapidAPI
    const handleDestinationSearch = async (query) => {
        setSearchQuery(query)
        if (query.length > 2) {
            try {
                const response = await fetch(`http://localhost:5000/api/places/autocomplete?input=${encodeURIComponent(query)}`, {
                    credentials: 'include'
                })
                const data = await response.json()
                console.log('Autocomplete response:', data)
                setSuggestions(data.slice(0, 5))
            } catch (error) {
                console.error('Autocomplete error:', error)
                setSuggestions([])
            }
        } else {
            setSuggestions([])
        }
    }


    try {
      const trip = await createTrip({
        ...formData,
        days: parseInt(formData.days),
        memberCount: formData.memberCount
      })
      
      toast({
        title: "Trip Created!",
        description: "Your AI-powered itinerary is ready.",
      })
      
      navigate(`/trip/${trip.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive"
      })
    }
  }

  const selectedTravelType = travelTypes.find(type => type.value === formData.travelType)
  const budgetOptions = getBudgetOptions()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create Your Perfect Trip
          </h1>
          <p className="text-lg text-gray-600">
            Tell us your preferences and let AI craft your personalized itinerary
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="mr-2 h-5 w-5 text-blue-600" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Destination *
                  </Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Delhi, Mumbai, Goa, Rajasthan"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="text-lg"
                  />
                </div>

                {/* Travel Type */}
                <div className="space-y-3">
                  <Label className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Travel Type *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {travelTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTravelTypeChange(type.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.travelType === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <type.icon className="h-5 w-5 mr-2" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-sm opacity-75">{type.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Member Count for Friends/Family */}
                {selectedTravelType?.allowCustomCount && (
                  <div className="space-y-2">
                    <Label htmlFor="memberCount" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Number of {formData.travelType === 'family' ? 'Family Members' : 'Friends'} *
                    </Label>
                    <Select 
                      value={formData.memberCount.toString()} 
                      onValueChange={handleMemberCountChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: selectedTravelType.maxCount - selectedTravelType.minCount + 1 }, 
                          (_, i) => selectedTravelType.minCount + i
                        ).map(count => (
                          <SelectItem key={count} value={count.toString()}>
                            {count} {count === 1 ? 'person' : 'people'}
                            {formData.travelType === 'family' && count > 2 && ' (including children)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {/* Days and Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Number of Days *
                    </Label>
                    <Select value={formData.days} onValueChange={(value) => setFormData(prev => ({ ...prev, days: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10,14,21].map(day => (
                          <SelectItem key={day} value={day.toString()}>
                            {day} {day === 1 ? 'day' : 'days'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Budget Range * {formData.memberCount > 1 && `(for ${formData.memberCount} people)`}
                    </Label>
                    <Select 
                      value={formData.budget} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                      disabled={!formData.travelType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.travelType ? "Select budget" : "Select travel type first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center">
                              <span className="mr-2">{option.icon}</span>
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.travelType && (
                      <p className="text-xs text-gray-500 mt-1">
                        Costs calculated for {formData.memberCount} {formData.memberCount === 1 ? 'person' : 'people'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-3">
                  <Label className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Travel Preferences * (Select at least one)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {preferenceOptions.map((preference) => (
                      <motion.button
                        key={preference}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePreferenceToggle(preference)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.preferences.includes(preference)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {preference}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Selected: {formData.preferences.length} preference{formData.preferences.length !== 1 ? 's' : ''}
                  </p>
                </div>=======
    const selectDestination = async (destination) => {
        setTripData(prev => ({ ...prev, destination }))
        setSearchQuery(destination)
        setSuggestions([])

        // Fetch destination info from Gemini
        setLoadingDestinationInfo(true)
        try {
            const response = await fetch('http://localhost:5000/api/trips/destination-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ destination })
            })

            if (response.ok) {
                const info = await response.json()
                console.log('Destination info:', info)
                setDestinationInfo(info)
                setTripData(prev => ({
                    ...prev,
                    totalBudget: info.minimumBudget.toString(),
                    interests: [] // Reset interests to show destination-specific ones
                }))
            }
        } catch (error) {
            console.error('Error fetching destination info:', error)
        } finally {
            setLoadingDestinationInfo(false)
        }

        setCurrentStep(2)
    }

    // Calendar functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const isDateDisabled = (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    }

    const isDateSelected = (date) => {
        if (!selectedStartDate) return false
        if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime()
        return date >= selectedStartDate && date <= selectedEndDate
    }

    const isDateInRange = (date) => {
        if (!selectedStartDate || !selectedEndDate) return false
        return date > selectedStartDate && date < selectedEndDate
    }

    const handleDateClick = (date) => {
        if (isDateDisabled(date)) return

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(date)
            setSelectedEndDate(null)
        } else if (date >= selectedStartDate) {
            setSelectedEndDate(date)
            const days = Math.ceil((date - selectedStartDate) / (1000 * 60 * 60 * 24))
            setTripData(prev => ({
                ...prev,
                startDate: selectedStartDate.toISOString().split('T')[0],
                endDate: date.toISOString().split('T')[0],
                days: days
            }))
        } else {
            setSelectedStartDate(date)
            setSelectedEndDate(null)
        }
    }

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth)
        const firstDay = getFirstDayOfMonth(currentMonth)
        const days = []

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>)
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const disabled = isDateDisabled(date)
            const selected = isDateSelected(date)
            const inRange = isDateInRange(date)

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    disabled={disabled}
                    className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all
            ${disabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-blue-100 cursor-pointer'
                        }
            ${selected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : ''
                        }
            ${inRange
                            ? 'bg-blue-100 text-blue-700'
                            : ''
                        }
          `}
                >
                    {day}
                </button>
            )
        }

        return days
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
                fromLocation: tripData.fromLocation || 'Current Location',
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
            case 2: return (tripData.startDate && tripData.endDate && tripData.days > 0) || unknownDates
            case 3: return tripData.tripType && tripData.totalBudget
            case 4: return tripData.interests.length > 0
            default: return true
        }
    }

    const getActivityIcon = (type) => {
        switch (type) {
            case 'restaurant': return ''
            case 'hotel': return ''
            case 'attraction': return ''
            case 'activity': return ''
            case 'transport': return ''
            case 'shopping': return ''
            case 'nature': return ''
            case 'cultural': return ''
            case 'spiritual': return ''
            default: return ''
        }
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

                            {loadingDestinationInfo && (
                                <div className="text-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                                    <p className="text-gray-600">Getting destination information...</p>
                                </div>
                            )}
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
                                    Choose a date range, up to 7 days.
                                </p>
                            </div>

                            {!unknownDates && (
                                <div className="max-w-2xl mx-auto">
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <button
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <h3 className="text-xl font-semibold">
                                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                        </h3>
                                        <button
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {dayNames.map(day => (
                                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                                {day}
                                            </div>
                                        ))}
                                        {renderCalendar()}
                                    </div>

                                    {selectedStartDate && selectedEndDate && (
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <p className="text-blue-800 font-medium">
                                                {tripData.days} day{tripData.days !== 1 ? 's' : ''} trip
                                            </p>
                                            <p className="text-blue-600 text-sm">
                                                {selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        setUnknownDates(!unknownDates)
                                        if (!unknownDates) {
                                            setTripData(prev => ({ ...prev, startDate: '', endDate: '', days: 7 }))
                                            setSelectedStartDate(null)
                                            setSelectedEndDate(null)
                                        }
                                    }}
                                    className="text-blue-600 hover:text-blue-700 underline"
                                >
                                    {unknownDates ? "I want to choose specific dates" : "I don't know my dates yet"}
                                </button>
                            </div>

                            {unknownDates && (
                                <div className="text-center p-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 mb-4">No worries! We'll create a flexible itinerary for you.</p>
                                    <div className="max-w-xs mx-auto">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            How many days do you want to travel?
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={tripData.days || ''}
                                            onChange={(e) => setTripData(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                                            className="text-center"
                                            placeholder="7"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Trip Type & Travelers */}
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
                                    Select one.
                                </p>
                            </div>

                            <div className="max-w-2xl mx-auto space-y-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {tripTypes.map((type) => (
                                        <Card
                                            key={type.id}
                                            className={`cursor-pointer transition-all duration-200 ${tripData.tripType === type.id
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

                                {/* Show children/pets options only for friends and family trips */}
                                {(tripData.tripType === 'friends' || tripData.tripType === 'family') && (
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
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Budget for the Trip
                                    </label>
                                    {destinationInfo && (
                                        <p className="text-sm text-blue-600 mb-2">
                                            Minimum recommended budget: {formatCurrency(destinationInfo.minimumBudget)}
                                        </p>
                                    )}
                                    <Input
                                        type="number"
                                        placeholder={destinationInfo ? destinationInfo.minimumBudget.toString() : "Enter your total budget"}
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
                                    Select your interests to get personalized recommendations for {tripData.destination}.
                                </p>
                            </div>

                            <div className="max-w-3xl mx-auto space-y-6">
                                {destinationInfo && destinationInfo.interests ? (
                                    (() => {
                                        const uniqueInterests = [...new Set([...defaultInterests, ...destinationInfo.interests])]
                                        const allInterests = shuffleArray(uniqueInterests)
                                        return (
                                            <div className="flex flex-wrap justify-center gap-4">
                                                {allInterests.map((interest, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => toggleInterest(interest)}
                                                        className={`
                relative px-6 py-3 rounded-full border-2 transition-all duration-200
                flex items-center justify-center text-base font-medium
                ${tripData.interests.includes(interest)
                                                                ? 'border-[#9333ea] bg-purple-50 text-[#9333ea] shadow-sm'
                                                                : 'border-gray-300 bg-white text-gray-700 hover:border-[#9333ea] hover:text-[#9333ea] hover:shadow-sm'
                                                            }
              `}
                                                    >
                                                        <span>{interest}</span>

                                                        {tripData.interests.includes(interest) && (
                                                            <div className="absolute top-2 right-2">
                                                                <div className="w-5 h-5 bg-[#9333ea] rounded-full flex items-center justify-center">
                                                                    <Check className="h-3 w-3 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                                        <p className="text-gray-600">Loading interests for {tripData.destination}...</p>
                                    </div>
                                )}

                                {/* Add custom interest */}
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Add custom interest..."
                                        value={customInterest}
                                        onChange={(e) => setCustomInterest(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                                    />
                                    <Button onClick={addCustomInterest}>Add</Button>
                                </div>

                                {/* Selected badges */}
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
                                    <h2 className="text-4xl font-bold text-green-600">{generatedTrip.destination}</h2>
                                </div>
                                <p className="text-gray-500 mt-2">
                                    {tripData.tripType} • {generatedTrip.totalDays} days • {formatCurrency(generatedTrip.itinerary?.estimatedCost?.total || tripData.totalBudget)}
                                </p>
                            </div>

                            <div className="space-y-8">
                                {generatedTrip.itinerary?.days?.map((day, dayIndex) => (
                                    <div key={dayIndex} className="space-y-6">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {day.day}
                                            </div>
                                            <h4 className="text-2xl font-bold text-gray-900">{day.title}</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {day.activities?.map((activity, actIndex) => (
                                                <Card key={actIndex} className="card-hover overflow-hidden shadow-lg">
                                                    <div className="relative h-48">
                                                        {activity.photos && activity.photos.length > 0 ? (
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

                                                    <CardContent className="p-6">
                                                        <h5 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                                                            {activity.name}
                                                        </h5>

                                                        {activity.rating && (
                                                            <div className="flex items-center space-x-1 mb-3">
                                                                <div className="flex items-center">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < Math.floor(activity.rating)
                                                                                ? 'text-yellow-400 fill-current'
                                                                                : 'text-gray-300'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-600 font-medium">
                                                                    {activity.rating}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                                                            {activity.description}
                                                        </p>

                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{activity.duration}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm font-bold text-gray-900">
                                                                <span>{formatCurrency(activity.cost)}</span>
                                                            </div>
                                                        </div>

                                                        {activity.googleMapsUrl && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-full"
                                                                onClick={() => window.open(activity.googleMapsUrl, '_blank')}
                                                            >
                                                                <Navigation className="h-4 w-4 mr-2" />
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