import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight,
  Book,
  Video,
  FileText,
  Users
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFAQ, setOpenFAQ] = useState(null)

  const helpCategories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using TripCraft',
      articles: 12
    },
    {
      icon: Users,
      title: 'Account & Profile',
      description: 'Manage your account settings',
      articles: 8
    },
    {
      icon: FileText,
      title: 'Trip Planning',
      description: 'Create and customize your trips',
      articles: 15
    },
    {
      icon: Video,
      title: 'AI Features',
      description: 'Understanding AI recommendations',
      articles: 6
    }
  ]

  const faqs = [
    {
      category: 'Getting Started',
      question: 'How do I create my first trip?',
      answer: 'To create your first trip, sign in to your account and click the "Create Trip" button. Fill in your destination, travel dates, budget, and preferences. Our AI will generate a personalized itinerary for you within seconds.'
    },
    {
      category: 'Getting Started',
      question: 'Is TripCraft free to use?',
      answer: 'TripCraft offers a free plan that includes 3 AI-generated trips per month. For unlimited trips and advanced features, you can upgrade to our Smart Traveler or Travel Pro plans.'
    },
    {
      category: 'Trip Planning',
      question: 'Can I modify the AI-generated itinerary?',
      answer: 'Yes! You can easily customize any part of your itinerary. Add, remove, or rearrange activities, change timings, and adjust your preferences. The AI will adapt to your changes.'
    },
    {
      category: 'Trip Planning',
      question: 'How accurate are the cost estimates?',
      answer: 'Our cost estimates are based on real-time data and historical averages. While they provide a good baseline, actual costs may vary depending on season, availability, and personal spending habits.'
    },
    {
      category: 'Account & Profile',
      question: 'How do I change my account settings?',
      answer: 'Go to your Profile page and click on "Account Settings". You can update your personal information, preferences, and notification settings from there.'
    },
    {
      category: 'Account & Profile',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account at any time from the Account Settings page. Please note that this action is irreversible and will permanently delete all your trips and data.'
    },
    {
      category: 'AI Features',
      question: 'How does the AI recommendation system work?',
      answer: 'Our AI analyzes your preferences, budget, travel style, and destination data to create personalized recommendations. It learns from millions of travel experiences to suggest the best activities, restaurants, and accommodations for you.'
    },
    {
      category: 'AI Features',
      question: 'Why are some recommendations not relevant to me?',
      answer: 'The AI improves over time as you use the platform. Make sure to update your preferences regularly and provide feedback on recommendations to help the AI learn your preferences better.'
    }
  ]

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with a support agent',
      availability: 'Mon-Fri, 9AM-6PM PST',
      action: 'Call Now'
    }
  ]

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
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
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions, browse our help articles, or get in touch with our support team.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {contactOptions.map((option, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-4">
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {option.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {option.availability}
                </p>
                <Button className="w-full">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <Badge variant="secondary">
                    {category.articles} articles
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              {filteredFAQs.length} questions found
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index} className="card-hover">
                <Collapsible>
                  <CollapsibleTrigger
                    className="w-full"
                    onClick={() => toggleFAQ(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <Badge variant="outline" className="mb-2">
                            {faq.category}
                          </Badge>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
                        {openFAQ === index ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="border-t pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or browse our help categories above.
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Still need help?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Help