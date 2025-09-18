import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'
import { useCurrency } from '../context/CurrencyContext'
import { useToast } from '../hooks/use-toast'
import {
    MapPin,
    Calendar,
    DollarSign,
    Users,
    Clock,
    Sparkles,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Loader2,
    Plus,
    X,
    Info
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import PlaceAutocomplete from '../components/PlaceAutocomplete'

const CreateTrip = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const { createTrip, generating } = useTrip()
    const { formatCurrency } = useCurrency()
    const { toast } = useToast()

    // Form state
    const [formData, setFormData] = useState({
        fromLocation: '',
        destination: '',
        startDate: '',
        endDate: '',
        days: 1,
        totalBudget: 50000,
        budgetCategory: 'medium',
        travelType: 'solo',
        memberCount: 1,
        preferences: [],
        withChildren: false,
        withPets: false
    })

    // UI state
    const [errors, setErrors] = useState({})
    const [step, setStep] = useState(1)
    const [destinationInfo, setDestinationInfo] = useState(null)
    const [loadingDestinationInfo, setLoadingDestinationInfo] = useState(false)
    const [customPreference, setCustomPreference] = useState('')

    // Available preferences based on destination
    const [availablePreferences, setAvailablePreferences] = useState([
        'Adventure Sports',
        'Cultural Experiences',
        'Food & Cuisine',
        'Historical Sites',
        'Nature & Wildlife',
        'Shopping',
        'Nightlife',
        'Photography',
        'Relaxation & Spa',
        'Local Markets',
        'Museums & Art',
        'Beach Activities'
    ])

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to create a trip.",
                variant: "destructive"
            })
            navigate('/')
        }
    }, [isAuthenticated, navigate, toast])

    // Calculate days when dates change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate)
            const end = new Date(formData.endDate)
            const diffTime = Math.abs(end - start)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

            if (diffDays > 0 && diffDays <= 30) {
                setFormData(prev => ({ ...prev, days: diffDays }))
                clearError('days')
            }
        }
    }, [formData.startDate, formData.endDate])

    // Fetch destination info when destination changes
    useEffect(() => {
        if (formData.destination && formData.destination.length > 2) {
            fetchDestinationInfo()
        }
    }, [formData.destination])

    const fetchDestinationInfo = async () => {
        setLoadingDestinationInfo(true)
        try {
            const response = await fetch('http://localhost:5000/api/trips/destination-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ destination: formData.destination })
            })

            if (response.ok) {
                const info = await response.json()
                setDestinationInfo(info)
                if (info.interests && info.interests.length > 0) {
                    setAvailablePreferences(info.interests)
                }
            }
        } catch (error) {
            console.error('Error fetching destination info:', error)
        } finally {
            setLoadingDestinationInfo(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        clearError(field)
    }

    const handlePreferenceToggle = (preference) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences.includes(preference)
                ? prev.preferences.filter(p => p !== preference)
                : [...prev.preferences, preference]
        }))
        clearError('preferences')
    }

    const addCustomPreference = () => {
        if (customPreference.trim() && !formData.preferences.includes(customPreference.trim())) {
            setFormData(prev => ({
                ...prev,
                preferences: [...prev.preferences, customPreference.trim()]
            }))
            setCustomPreference('')
        }
    }

    const removePreference = (preference) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences.filter(p => p !== preference)
        }))
    }

    const clearError = (field) => {
        setErrors(prev => ({ ...prev, [field]: null }))
    }

    const validateStep = (stepNumber) => {
        const newErrors = {}

        if (stepNumber === 1) {
            if (!formData.fromLocation.trim()) {
                newErrors.fromLocation = 'Starting location is required'
            }
            if (!formData.destination.trim()) {
                newErrors.destination = 'Destination is required'
            }
            if (!formData.startDate) {
                newErrors.startDate = 'Start date is required'
            }
            if (!formData.endDate) {
                newErrors.endDate = 'End date is required'
            }
            if (formData.startDate && formData.endDate) {
                const start = new Date(formData.startDate)
                const end = new Date(formData.endDate)
                if (start >= end) {
                    newErrors.endDate = 'End date must be after start date'
                }
                if (start < new Date().setHours(0, 0, 0, 0)) {
                    newErrors.startDate = 'Start date cannot be in the past'
                }
            }
        }

        if (stepNumber === 2) {
            if (!formData.totalBudget || formData.totalBudget < 1000) {
                newErrors.totalBudget = 'Budget must be at least ₹1,000'
            }
            if (destinationInfo && formData.totalBudget < destinationInfo.minimumBudget) {
                newErrors.totalBudget = `Minimum budget for ${formData.destination} is ${formatCurrency(destinationInfo.minimumBudget)}`
            }
            if (!formData.travelType) {
                newErrors.travelType = 'Travel type is required'
            }
            if (formData.memberCount < 1 || formData.memberCount > 10) {
                newErrors.memberCount = 'Member count must be between 1 and 10'
            }
        }

        if (stepNumber === 3) {
            if (formData.preferences.length === 0) {
                newErrors.preferences = 'Please select at least one preference'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1)
        } else {
            toast({
                title: "Validation Error",
                description: "Please fix the errors before continuing.",
                variant: "destructive"
            })
        }
    }

    const handleBack = () => {
        setStep(prev => prev - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateStep(3)) {
            toast({
                title: "Validation Error",
                description: "Please fix all errors before creating your trip.",
                variant: "destructive"
            })
            return
        }

        try {
            const tripData = {
                ...formData,
                userId: user.id || user.sub
            }

            const newTrip = await createTrip(tripData)

            if (newTrip) {
                toast({
                    title: "Trip Created Successfully! 🎉",
                    description: `Your ${formData.days}-day trip to ${formData.destination} is ready!`,
                })
                navigate(`/trip/${newTrip._id || newTrip.id}`)
            }
        } catch (error) {
            console.error('Error creating trip:', error)
            toast({
                title: "Error Creating Trip",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            })
        }
    }

    const getBudgetRecommendation = () => {
        if (!destinationInfo) return null

        const perPersonBudget = formData.totalBudget / formData.memberCount
        const recommended = destinationInfo.minimumBudget

        if (perPersonBudget < recommended) {
            return {
                type: 'warning',
                message: `Consider increasing budget to ${formatCurrency(recommended * formData.memberCount)} for a better experience`
            }
        } else if (perPersonBudget > recommended * 2) {
            return {
                type: 'success',
                message: 'Great budget! You can enjoy premium experiences'
            }
        } else {
            return {
                type: 'info',
                message: 'Good budget for a comfortable trip'
            }
        }
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Create Your Perfect Trip ✈️
                    </h1>
                    <p className="text-xl text-gray-600">
                        Let our AI plan an amazing journey just for you
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= stepNumber
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                                </div>
                                {stepNumber < 3 && (
                                    <div
                                        className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-sm text-gray-600">
                        Step {step} of 3: {
                            step === 1 ? 'Destination & Dates' :
                                step === 2 ? 'Budget & Travel Details' :
                                    'Preferences & Interests'
                        }
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="shadow-xl border-0">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Destination & Dates */}
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="fromLocation" className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                                    From (Starting Location) *
                                                </Label>
                                                <PlaceAutocomplete
                                                    value={formData.fromLocation}
                                                    onChange={(value) => handleInputChange('fromLocation', value)}
                                                    placeholder="Enter your starting location"
                                                    error={errors.fromLocation}
                                                />
                                                {errors.fromLocation && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.fromLocation}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="destination" className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                                                    To (Destination) *
                                                </Label>
                                                <PlaceAutocomplete
                                                    value={formData.destination}
                                                    onChange={(value) => handleInputChange('destination', value)}
                                                    placeholder="Where do you want to go?"
                                                    error={errors.destination}
                                                />
                                                {errors.destination && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.destination}
                                                    </p>
                                                )}
                                                {loadingDestinationInfo && (
                                                    <p className="text-sm text-blue-600 flex items-center">
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        Getting destination info...
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="startDate" className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                                                    Start Date *
                                                </Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className={errors.startDate ? 'border-red-500' : ''}
                                                />
                                                {errors.startDate && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.startDate}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="endDate" className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                                                    End Date *
                                                </Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                                    className={errors.endDate ? 'border-red-500' : ''}
                                                />
                                                {errors.endDate && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.endDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {formData.days > 1 && (
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-blue-800 flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Your trip will be <strong className="mx-1">{formData.days} days</strong> long
                                                </p>
                                            </div>
                                        )}

                                        {destinationInfo && (
                                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-900 mb-2">About {formData.destination}</h3>
                                                <p className="text-gray-700 text-sm">{destinationInfo.description}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 2: Budget & Travel Details */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="totalBudget" className="flex items-center">
                                                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                                                Total Budget (₹) *
                                            </Label>
                                            <Input
                                                id="totalBudget"
                                                type="number"
                                                value={formData.totalBudget}
                                                onChange={(e) => handleInputChange('totalBudget', parseInt(e.target.value) || 0)}
                                                min="1000"
                                                step="1000"
                                                className={errors.totalBudget ? 'border-red-500' : ''}
                                            />
                                            {errors.totalBudget && (
                                                <p className="text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {errors.totalBudget}
                                                </p>
                                            )}
                                            {getBudgetRecommendation() && (
                                                <div className={`p-3 rounded-lg ${getBudgetRecommendation().type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                                    getBudgetRecommendation().type === 'success' ? 'bg-green-50 text-green-800' :
                                                        'bg-blue-50 text-blue-800'
                                                    }`}>
                                                    <p className="text-sm flex items-center">
                                                        <Info className="h-4 w-4 mr-2" />
                                                        {getBudgetRecommendation().message}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="travelType" className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                                                    Travel Type *
                                                </Label>
                                                <Select value={formData.travelType} onValueChange={(value) => handleInputChange('travelType', value)}>
                                                    <SelectTrigger className={errors.travelType ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select travel type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="solo">Solo Travel</SelectItem>
                                                        <SelectItem value="couple">Couple</SelectItem>
                                                        <SelectItem value="friends">Friends</SelectItem>
                                                        <SelectItem value="family">Family</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.travelType && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.travelType}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="memberCount" className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                                                    Number of People *
                                                </Label>
                                                <Input
                                                    id="memberCount"
                                                    type="number"
                                                    value={formData.memberCount}
                                                    onChange={(e) => handleInputChange('memberCount', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    max="10"
                                                    className={errors.memberCount ? 'border-red-500' : ''}
                                                />
                                                {errors.memberCount && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {errors.memberCount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 mb-3">Budget Breakdown</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Per Person</p>
                                                    <p className="font-semibold">{formatCurrency(formData.totalBudget / formData.memberCount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Per Day</p>
                                                    <p className="font-semibold">{formatCurrency(formData.totalBudget / formData.days)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Per Person/Day</p>
                                                    <p className="font-semibold">{formatCurrency(formData.totalBudget / (formData.memberCount * formData.days))}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Total Budget</p>
                                                    <p className="font-semibold text-green-600">{formatCurrency(formData.totalBudget)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="withChildren"
                                                    checked={formData.withChildren}
                                                    onChange={(e) => handleInputChange('withChildren', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="withChildren">Traveling with children</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="withPets"
                                                    checked={formData.withPets}
                                                    onChange={(e) => handleInputChange('withPets', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="withPets">Traveling with pets</Label>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Preferences */}
                                {step === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <Label className="flex items-center mb-4">
                                                <Sparkles className="h-4 w-4 mr-2 text-yellow-600" />
                                                What interests you? (Select at least one) *
                                            </Label>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                                {availablePreferences.map((preference) => (
                                                    <button
                                                        key={preference}
                                                        type="button"
                                                        onClick={() => handlePreferenceToggle(preference)}
                                                        className={`p-3 rounded-lg border-2 transition-all text-left ${formData.preferences.includes(preference)
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <span className="text-sm font-medium">{preference}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {errors.preferences && (
                                                <p className="text-sm text-red-600 flex items-center mb-4">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {errors.preferences}
                                                </p>
                                            )}

                                            <div className="flex gap-2 mb-4">
                                                <Input
                                                    placeholder="Add custom preference..."
                                                    value={customPreference}
                                                    onChange={(e) => setCustomPreference(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPreference())}
                                                />
                                                <Button type="button" onClick={addCustomPreference} variant="outline">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {formData.preferences.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Selected preferences:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.preferences.map((preference) => (
                                                            <Badge
                                                                key={preference}
                                                                variant="secondary"
                                                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            >
                                                                {preference}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePreference(preference)}
                                                                    className="ml-2 hover:text-red-600"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 mb-3">Trip Summary</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Route</p>
                                                    <p className="font-medium">{formData.fromLocation} → {formData.destination}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Duration</p>
                                                    <p className="font-medium">{formData.days} days</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Travel Type</p>
                                                    <p className="font-medium capitalize">{formData.travelType} ({formData.memberCount} {formData.memberCount === 1 ? 'person' : 'people'})</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Budget</p>
                                                    <p className="font-medium text-green-600">{formatCurrency(formData.totalBudget)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8">
                                    {step > 1 && (
                                        <Button type="button" onClick={handleBack} variant="outline">
                                            Back
                                        </Button>
                                    )}

                                    <div className="ml-auto">
                                        {step < 3 ? (
                                            <Button type="button" onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                Next
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                disabled={generating}
                                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                                            >
                                                {generating ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Creating Your Trip...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        Create My Trip
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* AI Generation Status */}
                {generating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <CardContent className="p-6 text-center">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Creating Your Perfect Trip ✨</h3>
                                <p className="text-blue-100">
                                    Our AI is analyzing your preferences and creating a personalized itinerary...
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default CreateTrip