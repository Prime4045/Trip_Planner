import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTrip } from '../context/TripContext'
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
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select'
import { useToast } from '../hooks/use-toast'

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
    }

    if (formData.preferences.length === 0) {
      toast({
        title: "Select Preferences",
        description: "Please select at least one travel preference.",
        variant: "destructive"
      })
      return
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
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={generating}
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
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Generation Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Planning</h3>
              </div>
              <p className="text-gray-600">
                Our advanced AI will analyze your preferences and create a detailed, 
                personalized itinerary with real places, timings, and cost estimates.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateTrip