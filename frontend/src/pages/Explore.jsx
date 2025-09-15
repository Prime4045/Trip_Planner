import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, Clock, DollarSign, Filter, Grid, List } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [destinations, setDestinations] = useState([])

  // Mock destinations data
  const mockDestinations = [
    {
      id: 1,
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
      rating: 4.8,
      reviews: 2847,
      category: 'cultural',
      duration: '3-5 days',
      budget: 'medium',
      description: 'The City of Light offers world-class museums, iconic landmarks, and romantic atmosphere.',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées']
    },
    {
      id: 2,
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
      rating: 4.9,
      reviews: 3241,
      category: 'cultural',
      duration: '4-7 days',
      budget: 'high',
      description: 'A fascinating blend of ultra-modern and traditional, with incredible food and culture.',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market', 'Mount Fuji']
    },
    {
      id: 3,
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500',
      rating: 4.7,
      reviews: 1923,
      category: 'beach',
      duration: '5-10 days',
      budget: 'low',
      description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture.',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur']
    },
    {
      id: 4,
      name: 'Swiss Alps, Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      rating: 4.9,
      reviews: 1567,
      category: 'adventure',
      duration: '4-8 days',
      budget: 'high',
      description: 'Breathtaking mountain scenery perfect for hiking, skiing, and outdoor adventures.',
      highlights: ['Matterhorn', 'Jungfraujoch', 'Lake Geneva', 'Zermatt']
    },
    {
      id: 5,
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
      rating: 4.8,
      reviews: 2156,
      category: 'beach',
      duration: '3-6 days',
      budget: 'medium',
      description: 'Iconic white-washed buildings, stunning sunsets, and crystal-clear waters.',
      highlights: ['Oia Village', 'Red Beach', 'Akrotiri', 'Wine Tasting']
    },
    {
      id: 6,
      name: 'New York City, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500',
      rating: 4.6,
      reviews: 4521,
      category: 'urban',
      duration: '3-7 days',
      budget: 'high',
      description: 'The city that never sleeps, with world-class attractions and endless entertainment.',
      highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Broadway']
    }
  ]

  const categories = [
    { value: 'all', label: 'All Destinations' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'beach', label: 'Beach' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'urban', label: 'Urban' },
    { value: 'nature', label: 'Nature' }
  ]

  useEffect(() => {
    // Filter destinations based on search and category
    let filtered = mockDestinations

    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory)
    }

    setDestinations(filtered)
  }, [searchQuery, selectedCategory])

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
      case 'low': return 'Budget-Friendly'
      case 'medium': return 'Mid-Range'
      case 'high': return 'Luxury'
      default: return budget
    }
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
            Explore Amazing Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next adventure from our curated collection of world-class destinations
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {destinations.length} Destinations Found
            </h2>
          </div>

          {destinations.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center">
                  <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No destinations found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or browse all destinations
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={getBudgetColor(destination.budget)}>
                          {getBudgetLabel(destination.budget)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {destination.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{destination.rating}</span>
                          <span className="text-sm text-gray-500">({destination.reviews})</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {destination.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {destination.duration}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {destination.category}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {destination.highlights.slice(0, 3).map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {destination.highlights.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{destination.highlights.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full">
                        Plan Trip to {destination.name.split(',')[0]}
                      </Button>
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

export default Explore