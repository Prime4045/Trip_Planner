import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Navigation
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
  const { formatCurrency, getCurrencySymbol } = useCurrency()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    fromLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    preferences: []
  })

  const preferenceOptions = [
    'Adventure', 'Cultural Heritage', 'Food & Cuisine', 'Nature & Wildlife',
    'History & Monuments', 'Shopping', 'Photography', 'Museums',
    'Local Experiences', 'Nightlife', 'Beaches', 'Mountains',
    'Architecture', 'Art & Galleries', 'Sports', 'Festivals'
  ]

  const handlePreferenceToggle = (preference) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }))
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.fromLocation || !formData.destination || !formData.startDate || !formData.endDate || !formData.totalBudget) {
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

    const days = calculateDays()
    if (days <= 0) {
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
        days: days,
        totalBudget: parseInt(formData.totalBudget),
        preferences: formData.preferences
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
                {/* From and To Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromLocation" className="flex items-center">
                      <Navigation className="mr-2 h-4 w-4" />
                      From (Starting Point) *
                    </Label>
                    <Input
                      id="fromLocation"
                      placeholder="e.g., Delhi, Mumbai, Your City"
                      value={formData.fromLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      To (Destination) *
                    </Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Paris, Tokyo, Bali, New York"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      className="text-lg"
                    />
                  </div>
                </div>

                {/* Travel Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Return Date *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Trip Duration Display */}
                {formData.startDate && formData.endDate && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Trip Duration:</strong> {calculateDays()} days
                    </p>
                  </div>
                )}

                {/* Total Budget */}
                <div className="space-y-2">
                  <Label htmlFor="totalBudget" className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Total Trip Budget ({getCurrencySymbol()}) *
                  </Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    placeholder={`Enter your total budget in ${getCurrencySymbol()}`}
                    value={formData.totalBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                    className="text-lg"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">
                    This will be distributed across accommodation, food, activities, and transport
                  </p>
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