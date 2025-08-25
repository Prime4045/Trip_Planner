import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Plane,
  DollarSign,
  Clock,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'

const Profile = () => {
  const { user } = useAuth()
  const { trips } = useTrip()

  const totalDays = trips.reduce((sum, trip) => sum + trip.days, 0)
  const totalCost = trips.reduce((sum, trip) => sum + (trip.itinerary?.estimatedCost?.total || 0), 0)
  const uniqueDestinations = new Set(trips.map(trip => trip.destination)).size
  const favoritePreferences = trips.flatMap(trip => trip.preferences || [])
    .reduce((acc, pref) => {
      acc[pref] = (acc[pref] || 0) + 1
      return acc
    }, {})

  const topPreferences = Object.entries(favoritePreferences)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([pref]) => pref)

  const stats = [
    {
      icon: Plane,
      label: 'Total Trips',
      value: trips.length,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MapPin,
      label: 'Destinations Visited',
      value: uniqueDestinations,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Calendar,
      label: 'Days Traveled',
      value: totalDays,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: `₹${totalCost.toLocaleString('en-IN')}`,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ]

  const achievements = [
    {
      icon: '🌟',
      title: 'First Trip',
      description: 'Created your first AI-powered itinerary',
      earned: trips.length >= 1
    },
    {
      icon: '🗺️',
      title: 'Explorer',
      description: 'Visited 5 different destinations',
      earned: uniqueDestinations >= 5
    },
    {
      icon: '📅',
      title: 'Time Traveler',
      description: 'Planned trips totaling 30+ days',
      earned: totalDays >= 30
    },
    {
      icon: '💎',
      title: 'Luxury Traveler',
      description: 'Planned a luxury trip',
      earned: trips.some(trip => trip.budget === 'high')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || user?.picture} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.name}
                  </h1>
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user?.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member since {new Date(user?.createdAt || user?.updated_at || Date.now()).getFullYear()}
                    </div>
                  </div>
                  
                  {topPreferences.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Favorite Travel Styles:</p>
                      <div className="flex flex-wrap gap-2">
                        {topPreferences.map((pref, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        {achievement.earned && (
                          <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trips.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No trips yet. Start planning your first adventure!
                </p>
              ) : (
                <div className="space-y-4">
                  {trips.slice(0, 5).map((trip, index) => (
                    <div key={trip._id || trip.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{trip.destination}</h4>
                        <p className="text-sm text-gray-600">
                          {trip.days} days • {trip.budget} budget • 
                          Created {new Date(trip.createdAt || trip.updatedAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        ₹{trip.itinerary?.estimatedCost?.total?.toLocaleString('en-IN') || 'N/A'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile