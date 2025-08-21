import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search,
  Filter,
  TrendingUp,
  MapPin,
  Camera,
  Plane
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPosts, setFilteredPosts] = useState([])

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Planning Your First Solo Trip',
      slug: 'ultimate-guide-solo-travel',
      excerpt: 'Discover the secrets to planning an amazing solo adventure with confidence and safety tips from experienced travelers.',
      content: 'Full blog post content would go here...',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      },
      category: 'Travel Tips',
      tags: ['Solo Travel', 'Planning', 'Safety', 'Adventure'],
      publishedAt: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
      featured: true
    },
    {
      id: 2,
      title: 'Hidden Gems of Southeast Asia: 10 Destinations You Must Visit',
      slug: 'hidden-gems-southeast-asia',
      excerpt: 'Explore breathtaking destinations in Southeast Asia that are off the beaten path but absolutely worth the journey.',
      content: 'Full blog post content would go here...',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      category: 'Destinations',
      tags: ['Southeast Asia', 'Hidden Gems', 'Adventure', 'Culture'],
      publishedAt: '2024-01-12',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      featured: false
    },
    {
      id: 3,
      title: 'Budget Travel Hacks: How to See the World for Less',
      slug: 'budget-travel-hacks',
      excerpt: 'Learn proven strategies to travel more while spending less, from finding cheap flights to budget accommodations.',
      content: 'Full blog post content would go here...',
      author: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
      },
      category: 'Budget Travel',
      tags: ['Budget', 'Money Saving', 'Tips', 'Backpacking'],
      publishedAt: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
      featured: false
    },
    {
      id: 4,
      title: 'Photography Tips for Travel: Capturing Perfect Moments',
      slug: 'travel-photography-tips',
      excerpt: 'Master the art of travel photography with these professional tips and techniques for stunning vacation photos.',
      content: 'Full blog post content would go here...',
      author: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      },
      category: 'Photography',
      tags: ['Photography', 'Tips', 'Camera', 'Memories'],
      publishedAt: '2024-01-08',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600',
      featured: false
    },
    {
      id: 5,
      title: 'Sustainable Travel: How to Be an Eco-Friendly Tourist',
      slug: 'sustainable-travel-guide',
      excerpt: 'Learn how to minimize your environmental impact while traveling and support local communities responsibly.',
      content: 'Full blog post content would go here...',
      author: {
        name: 'Lisa Thompson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
      },
      category: 'Sustainable Travel',
      tags: ['Sustainability', 'Eco-friendly', 'Responsible Travel', 'Environment'],
      publishedAt: '2024-01-05',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      featured: false
    },
    {
      id: 6,
      title: 'Digital Nomad Guide: Working While Traveling',
      slug: 'digital-nomad-guide',
      excerpt: 'Everything you need to know about becoming a digital nomad, from finding remote work to staying productive on the road.',
      content: 'Full blog post content would go here...',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      category: 'Digital Nomad',
      tags: ['Digital Nomad', 'Remote Work', 'Productivity', 'Lifestyle'],
      publishedAt: '2024-01-03',
      readTime: '15 min read',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600',
      featured: true
    }
  ]

  const categories = [
    { value: 'all', label: 'All Posts', icon: TrendingUp },
    { value: 'Travel Tips', label: 'Travel Tips', icon: Plane },
    { value: 'Destinations', label: 'Destinations', icon: MapPin },
    { value: 'Photography', label: 'Photography', icon: Camera },
    { value: 'Budget Travel', label: 'Budget Travel', icon: TrendingUp },
    { value: 'Sustainable Travel', label: 'Sustainable Travel', icon: TrendingUp },
    { value: 'Digital Nomad', label: 'Digital Nomad', icon: TrendingUp }
  ]

  useEffect(() => {
    let filtered = blogPosts

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const featuredPost = blogPosts.find(post => post.featured)

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
            Travel Blog & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover travel tips, destination guides, and inspiring stories from fellow adventurers around the world.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="overflow-hidden card-hover">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Featured Post
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {featuredPost.author.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(featuredPost.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Read Full Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
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
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredPosts.length} Articles Found
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or browse all articles
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full card-hover overflow-hidden">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          {post.author.name}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatDate(post.publishedAt)}
                        </span>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            Read More
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Never Miss a Travel Story
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest travel tips, destination guides, 
                and inspiring stories delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white text-gray-900"
                />
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Blog