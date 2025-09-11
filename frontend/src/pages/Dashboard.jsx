import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'
import { useCurrency } from '../context/CurrencyContext'
import {
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Trash2,
  ExternalLink,
  Plane,
  Clock
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const { trips, loading, deleteTrip, fetchUserTrips } = useTrip()
  const { formatCurrency } = useCurrency()

  useEffect(() => {
    fetchUserTrips()
  }, [])

  const formatDate = (date) => {
    // Handle both Firebase timestamp and regular date
    const dateObj = date?.seconds ? new Date(date.seconds * 1000) : new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  if (loading) {
    return <LoadingSpinner message="Loading your trips..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || user?.picture || user?.googleAvatar} alt={user?.name} />
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600">
                  Ready to plan your next adventure?
                </p>
              </div>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link to="/create-trip" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destinations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(trips.map(trip => trip.destination)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trips.reduce((sum, trip) => sum + trip.days, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
            {trips.length > 0 && (
              <p className="text-gray-600">{trips.length} trip{trips.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {trips.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Plane className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No trips yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start planning your first adventure with AI assistance
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link to="/create-trip" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Trip
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
                <motion.div
                  key={trip._id || trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover border-0 shadow-lg overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      <div className="absolute inset-0 bg-black/20" />
                    <div key={trip._id || trip.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center`}
                          alt={trip.destination}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-80"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Plane className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          {trip.days} days • {formatCurrency(trip.totalBudget)} •
                          onClick={() => deleteTrip(trip._id || trip.id)}
                          className="text-white hover:bg-white/20"
                        >
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Created {formatDate(trip.createdAt || trip.updatedAt)}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Budget: {formatCurrency(trip.totalBudget || trip.itinerary?.estimatedCost?.total)}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {trip.preferences?.slice(0, 3).map((pref, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {pref}
                            </span>
                          ))}
                          {trip.preferences?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{trip.preferences.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button asChild className="flex-1">
                          <Link to={`/trip/${trip._id || trip.id}`} className="flex items-center justify-center">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Trip
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard