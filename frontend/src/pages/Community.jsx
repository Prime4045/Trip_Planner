import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth0 } from '@auth0/auth0-react'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar, 
  DollarSign,
  Plus,
  Filter,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

const Community = () => {
  const { isAuthenticated, user } = useAuth0()
  const [activeTab, setActiveTab] = useState('trending')
  const [communityTrips, setCommunityTrips] = useState([])

  // Mock community trips data
  const mockCommunityTrips = [
    {
      id: 1,
      title: 'Ultimate Japan Adventure: Tokyo to Kyoto',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        verified: true
      },
      destination: 'Japan',
      duration: 14,
      budget: 'medium',
      likes: 234,
      comments: 45,
      shares: 12,
      createdAt: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
      description: 'An incredible 2-week journey through Japan\'s most iconic cities, from the bustling streets of Tokyo to the serene temples of Kyoto.',
      tags: ['Cultural', 'Food', 'Adventure', 'Photography'],
      highlights: ['Cherry Blossom Season', 'Traditional Ryokans', 'Street Food Tours', 'Temple Visits']
    },
    {
      id: 2,
      title: 'European Backpacking: 10 Countries in 30 Days',
      author: {
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        verified: false
      },
      destination: 'Europe',
      duration: 30,
      budget: 'low',
      likes: 189,
      comments: 67,
      shares: 23,
      createdAt: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=500',
      description: 'Budget-friendly backpacking route through 10 European countries with insider tips for saving money.',
      tags: ['Budget', 'Backpacking', 'Cultural', 'Adventure'],
      highlights: ['Hostel Recommendations', 'Train Routes', 'Free Activities', 'Local Markets']
    },
    {
      id: 3,
      title: 'Luxury Safari Experience in Kenya',
      author: {
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        verified: true
      },
      destination: 'Kenya',
      duration: 7,
      budget: 'high',
      likes: 156,
      comments: 28,
      shares: 15,
      createdAt: '2024-01-08',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500',
      description: 'Unforgettable luxury safari experience in Maasai Mara with world-class accommodations.',
      tags: ['Luxury', 'Wildlife', 'Safari', 'Photography'],
      highlights: ['Big Five Sightings', 'Luxury Lodges', 'Hot Air Balloon', 'Cultural Visits']
    },
    {
      id: 4,
      title: 'Island Hopping in Greece: Santorini & Mykonos',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        verified: false
      },
      destination: 'Greece',
      duration: 10,
      budget: 'medium',
      likes: 298,
      comments: 52,
      shares: 31,
      createdAt: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
      description: 'Perfect island hopping itinerary covering the most beautiful Greek islands with stunning sunsets.',
      tags: ['Beach', 'Islands', 'Romantic', 'Photography'],
      highlights: ['Sunset Views', 'Beach Clubs', 'Local Cuisine', 'Boat Tours']
    }
  ]

  useEffect(() => {
    setCommunityTrips(mockCommunityTrips)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getBudgetColor = (budget) => {
    switch (budget) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getBudgetLabel = (budget) => {
    switch (budget) {
      case 'low': return 'Budget'
      case 'medium': return 'Mid-Range'
      case 'high': return 'Luxury'
      default: return budget
    }
  }

  const handleLike = (tripId) => {
    setCommunityTrips(prev => 
      prev.map(trip => 
        trip.id === tripId 
          ? { ...trip, likes: trip.likes + 1 }
          : trip
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing trips shared by fellow travelers and get inspired for your next adventure
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="trending" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isAuthenticated && (
            <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Share Your Trip
            </Button>
          )}
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Shared Trips</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15,234</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
              <div className="text-sm text-gray-600">Countries Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="trending" className="space-y-6">
              {communityTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={trip.image}
                          alt={trip.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={trip.author.avatar} alt={trip.author.name} />
                              <AvatarFallback>
                                {trip.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{trip.author.name}</span>
                                {trip.author.verified && (
                                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{formatDate(trip.createdAt)}</span>
                            </div>
                          </div>
                          
                          <Badge className={getBudgetColor(trip.budget)}>
                            {getBudgetLabel(trip.budget)}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {trip.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {trip.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {trip.destination}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {trip.duration} days
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {trip.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <button
                              onClick={() => handleLike(trip.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{trip.likes}</span>
                            </button>
                            
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">{trip.comments}</span>
                            </button>
                            
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                              <Share2 className="h-4 w-4" />
                              <span className="text-sm">{trip.shares}</span>
                            </button>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-6">
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Recent Trips</h3>
                <p className="text-gray-600">Latest trips shared by the community</p>
              </div>
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Following</h3>
                <p className="text-gray-600">
                  {isAuthenticated 
                    ? "Trips from travelers you follow"
                    : "Sign in to follow other travelers and see their trips"
                  }
                </p>
                {!isAuthenticated && (
                  <Button className="mt-4">Sign In to Follow</Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default Community