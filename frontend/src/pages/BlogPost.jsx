import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Heart,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useToast } from '../hooks/use-toast'

const BlogPost = () => {
  const { slug } = useParams()
  const { toast } = useToast()
  const [post, setPost] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Mock blog post data - in real app, this would come from API
  const mockPost = {
    id: 1,
    title: 'The Ultimate Guide to Planning Your First Solo Trip',
    slug: 'ultimate-guide-solo-travel',
    excerpt: 'Discover the secrets to planning an amazing solo adventure with confidence and safety tips from experienced travelers.',
    content: `
      <h2>Why Solo Travel is Life-Changing</h2>
      <p>Solo travel is one of the most rewarding experiences you can have. It pushes you out of your comfort zone, builds confidence, and allows you to discover who you truly are when you're completely on your own.</p>
      
      <p>When I took my first solo trip to Thailand five years ago, I was terrified. I had never traveled alone before, and the thought of navigating a foreign country by myself seemed overwhelming. But that trip changed my life in ways I never expected.</p>
      
      <h2>Planning Your First Solo Adventure</h2>
      <p>The key to a successful solo trip is thorough planning. Here are the essential steps you need to take:</p>
      
      <h3>1. Choose the Right Destination</h3>
      <p>For your first solo trip, consider destinations that are:</p>
      <ul>
        <li>Safe for solo travelers</li>
        <li>English-speaking or with good tourist infrastructure</li>
        <li>Well-connected with reliable transportation</li>
        <li>Have a strong backpacker/solo traveler community</li>
      </ul>
      
      <p>Some excellent first-time solo destinations include:</p>
      <ul>
        <li><strong>New Zealand</strong> - Incredibly safe, English-speaking, and perfect for outdoor adventures</li>
        <li><strong>Japan</strong> - Extremely safe, efficient transportation, and unique cultural experiences</li>
        <li><strong>Portugal</strong> - Affordable, friendly locals, and beautiful coastal cities</li>
        <li><strong>Costa Rica</strong> - Great for nature lovers, well-established tourist routes</li>
      </ul>
      
      <h3>2. Safety First</h3>
      <p>Safety should be your top priority when traveling alone. Here are essential safety tips:</p>
      <ul>
        <li>Research your destination thoroughly</li>
        <li>Share your itinerary with family/friends</li>
        <li>Keep copies of important documents</li>
        <li>Trust your instincts</li>
        <li>Stay connected with regular check-ins</li>
      </ul>
      
      <h3>3. Accommodation Strategies</h3>
      <p>Choosing the right accommodation can make or break your solo trip:</p>
      <ul>
        <li><strong>Hostels</strong> - Great for meeting other travelers and budget-friendly</li>
        <li><strong>Guesthouses</strong> - More privacy while still being social</li>
        <li><strong>Hotels</strong> - Maximum comfort and security</li>
        <li><strong>Airbnb</strong> - Local experience and often good value</li>
      </ul>
      
      <h2>Overcoming Solo Travel Fears</h2>
      <p>It's completely normal to feel nervous about solo travel. Here's how to overcome common fears:</p>
      
      <h3>Fear of Being Lonely</h3>
      <p>Solo travel doesn't mean you have to be alone all the time. Stay in social accommodations, join group tours, use apps like Meetup to find local events, and don't be afraid to strike up conversations with fellow travelers.</p>
      
      <h3>Fear of Getting Lost</h3>
      <p>With modern technology, getting truly lost is rare. Download offline maps, carry a physical map as backup, and don't be afraid to ask for directions. Getting a little lost can lead to unexpected discoveries!</p>
      
      <h3>Fear of Language Barriers</h3>
      <p>Learn basic phrases in the local language, use translation apps, and remember that a smile and gestures can go a long way. Most people are patient and helpful with travelers making an effort.</p>
      
      <h2>Making the Most of Your Solo Journey</h2>
      <p>Solo travel offers unique opportunities that group travel doesn't:</p>
      <ul>
        <li>Complete freedom to follow your interests</li>
        <li>Easier to meet locals and other travelers</li>
        <li>More opportunities for self-reflection and growth</li>
        <li>Flexibility to change plans on a whim</li>
      </ul>
      
      <h2>Final Thoughts</h2>
      <p>Your first solo trip will likely be challenging, exciting, scary, and amazing all at once. Embrace the uncertainty, trust yourself, and remember that every experienced solo traveler was once exactly where you are now.</p>
      
      <p>The confidence and independence you'll gain from solo travel will benefit you long after you return home. So take that leap, book that ticket, and embark on the adventure of a lifetime. You've got this!</p>
    `,
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      bio: 'Travel blogger and solo adventure enthusiast who has visited 50+ countries. Passionate about helping others discover the joy of independent travel.',
      social: {
        twitter: '@sarahtravels',
        instagram: '@sarahwanders'
      }
    },
    category: 'Travel Tips',
    tags: ['Solo Travel', 'Planning', 'Safety', 'Adventure'],
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    likes: 234,
    bookmarks: 89
  }

  useEffect(() => {
    // In a real app, you'd fetch the post by slug from your API
    setPost(mockPost)
  }, [slug])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Post removed from your favorites" : "Post added to your favorites",
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmarked",
      description: isBookmarked ? "Post removed from bookmarks" : "Post saved to bookmarks",
    })
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = post.title
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Post link copied to clipboard",
        })
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/blog">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? 'text-red-600 border-red-600' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    {post.likes + (isLiked ? 1 : 0)}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className={isBookmarked ? 'text-blue-600 border-blue-600' : ''}
                  >
                    <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                    {post.bookmarks + (isBookmarked ? 1 : 0)}
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('linkedin')}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('copy')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {post.author.bio}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <a 
                      href={`https://twitter.com/${post.author.social.twitter.replace('@', '')}`}
                      className="text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.author.social.twitter}
                    </a>
                    <a 
                      href={`https://instagram.com/${post.author.social.instagram.replace('@', '')}`}
                      className="text-pink-600 hover:text-pink-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.author.social.instagram}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                More Travel Tips
              </h3>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Discover more amazing travel stories and tips
                </p>
                <Link to="/blog">
                  <Button>
                    View All Posts
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default BlogPost