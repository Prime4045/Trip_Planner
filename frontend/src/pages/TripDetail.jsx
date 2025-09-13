import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTrip } from '../context/TripContext'
import { useCurrency } from '../context/CurrencyContext'
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  ArrowLeft,
  Star,
  Navigation,
  Camera,
  Leaf,
  Download
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import LoadingSpinner from '../components/LoadingSpinner'

const TripDetail = () => {
  const { id } = useParams()
  const { currentTrip, getTripById } = useTrip()
  const { formatCurrency } = useCurrency()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true)
      await getTripById(id)
      setLoading(false)
    }
    fetchTrip()
  }, [id])

  if (loading) {
    return <LoadingSpinner message="Loading your trip..." />
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date) => {
    const dateObj = date?.seconds ? new Date(date.seconds * 1000) : new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
      default: return '📍'
    }
  }

  const exportToPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link to="/dashboard" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Button onClick={exportToPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {currentTrip.fromLocation} → {currentTrip.destination}
            </h1>
            <p className="text-lg text-gray-600">
              {currentTrip.days} days • {formatCurrency(currentTrip.totalBudget)} total budget • Created {formatDate(currentTrip.createdAt)}
            </p>
            {currentTrip.startDate && currentTrip.endDate && (
              <p className="text-gray-500">
                {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
              </p>
            )}
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estimated Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(currentTrip.itinerary?.estimatedCost?.total || currentTrip.totalBudget)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentTrip.days} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Carbon Footprint</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentTrip.itinerary?.carbonFootprint?.total || 'N/A'} kg CO₂
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentTrip.preferences?.map((preference, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {preference}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Your Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="day-1" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
                  {currentTrip.itinerary?.days?.map((day) => (
                    <TabsTrigger key={day.day} value={`day-${day.day}`}>
                      Day {day.day}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {currentTrip.itinerary?.days?.map((day) => (
                  <TabsContent key={day.day} value={`day-${day.day}`} className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">{day.title}</h3>
                      <p className="text-gray-600">Day {day.day} of {currentTrip.days}</p>
                    </div>

                    <div className="space-y-4">
                      {day.activities?.length > 0 ? (
                        day.activities.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="card-hover">
                              <CardContent className="p-6 bg-white">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <span className="text-2xl mr-3">{getActivityIcon(activity.type)}</span>
                                      <div>
                                        <h4 className="text-lg font-semibold text-gray-900">
                                          {activity.name}
                                        </h4>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                          <span className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {activity.time}
                                          </span>
                                          <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {activity.duration}
                                          </span>
                                          <span className="flex items-center">
                                            {formatCurrency(activity.cost || 0)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-gray-600 mb-3">{activity.description}</p>

                                    {activity.address && (
                                      <p className="text-sm text-gray-500 flex items-center mb-3">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {activity.address}
                                      </p>
                                    )}

                                    {activity.rating && (
                                      <div className="flex items-center mb-3">
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <span className="text-sm font-medium">{activity.rating}</span>
                                        <span className="text-sm text-gray-500 ml-1">Google Rating</span>
                                      </div>
                                    )}

                                    {/* Photos */}
                                    {activity.photos && activity.photos.length > 0 && (
                                      <div className="flex space-x-2 mb-4 bg-transparent">
                                        {activity.photos.slice(0, 3).map((photo, photoIndex) => (
                                          <img
                                            key={photoIndex}
                                            src={photo}
                                            alt={activity.name}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="ml-4">
                                    <Button
                                      asChild
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <a
                                        href={activity.googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                      >
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Maps
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">No activities planned for this day.</p>
                          <Button asChild variant="outline">
                            <Link to="/create-trip">Explore Destinations</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cost Breakdown */}
        {currentTrip.itinerary?.estimatedCost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(currentTrip.itinerary.estimatedCost)
                    .filter(([key]) => key !== 'currency')
                    .map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 capitalize">
                          {key === 'total' ? 'Total Cost' : key}
                        </p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(value)}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TripDetail