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
  Sparkles
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
    preferences: []
  })

  const budgetOptions = [
    { value: 'low', label: 'Budget-Friendly ($50-100/day)', icon: '💰' },
    { value: 'medium', label: 'Mid-Range ($100-300/day)', icon: '💳' },
    { value: 'high', label: 'Luxury ($300+/day)', icon: '💎' }
  ]

  const preferenceOptions = [
    'Adventure', 'Cultural', 'Relaxing', 'Nightlife', 'Food & Dining',
    'Nature', 'History', 'Shopping', 'Photography', 'Beach',
    'Mountains', 'Museums', 'Local Experiences', 'Wellness'
  ]

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
    
    if (!formData.destination || !formData.days || !formData.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
        days: parseInt(formData.days)
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
                    placeholder="e.g., Paris, Tokyo, New York"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="text-lg"
                  />
                </div>

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
                      Budget Range *
                    </Label>
                    <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
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
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-3">
                  <Label className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
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