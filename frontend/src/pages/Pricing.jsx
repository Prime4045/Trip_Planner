import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Star, Zap, Crown, Gift } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

const Pricing = () => {
  const { formatCurrency, getCurrencySymbol } = useCurrency()
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: 'Free Explorer',
      icon: Gift,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for occasional travelers',
      features: [
        '3 AI-generated trips per month',
        'Basic destination recommendations',
        'Community access',
        'Standard support',
        'Mobile app access'
      ],
      limitations: [
        'Limited customization options',
        'No offline access',
        'Basic export options'
      ],
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Smart Traveler',
      icon: Zap,
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For frequent travelers who want more',
      features: [
        'Unlimited AI-generated trips',
        'Advanced personalization',
        'Priority support',
        'Offline trip access',
        'PDF export & sharing',
        'Weather integration',
        'Budget tracking',
        'Photo recommendations'
      ],
      limitations: [],
      popular: true,
      color: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Travel Pro',
      icon: Crown,
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Ultimate travel planning experience',
      features: [
        'Everything in Smart Traveler',
        'Concierge support',
        'Custom trip templates',
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'White-label options',
        'Priority feature requests'
      ],
      limitations: [],
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment in full.'
    },
    {
      question: 'Can I use TripCraft offline?',
      answer: 'Smart Traveler and Travel Pro plans include offline access to your saved trips and itineraries.'
    }
  ]

  const getPrice = (plan) => {
    return billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly
  }

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.price.monthly > 0) {
      const yearlyTotal = plan.price.monthly * 12
      const savings = yearlyTotal - plan.price.yearly
      return Math.round((savings / yearlyTotal) * 100)
    }
    return 0
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
            Choose Your Adventure Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start planning amazing trips with AI-powered recommendations. 
            Choose the plan that fits your travel style.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <Tabs value={billingCycle} onValueChange={setBillingCycle} className="w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Yearly
                <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                  Save up to 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''} card-hover`}>
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} mx-auto mb-4`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600">{plan.description}</p>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price.monthly === 0 ? 'Free' : formatCurrency(getPrice(plan))}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-gray-600 ml-1">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    
                    {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                      <Badge className="mt-2 bg-green-100 text-green-700">
                        Save {getSavings(plan)}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start">
                        <X className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.price.monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </Button>
                  
                  {plan.price.monthly > 0 && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      14-day free trial • No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Features</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Smart</th>
                      <th className="text-center py-3 px-4">Pro</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4">AI-generated trips</td>
                      <td className="text-center py-3 px-4">3/month</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Offline access</td>
                      <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Priority support</td>
                      <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Team collaboration</td>
                      <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Pricing