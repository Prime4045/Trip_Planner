import { motion } from 'framer-motion'
import { FileText, Scale, AlertTriangle, Users, CreditCard, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Terms = () => {
  const sections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      content: `
        <p>By accessing and using TripCraft ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
        <p>If you do not agree to abide by the above, please do not use this service. These Terms of Service apply to all users of the service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
      `
    },
    {
      icon: FileText,
      title: 'Description of Service',
      content: `
        <p>TripCraft is an AI-powered travel planning platform that provides:</p>
        <ul>
          <li>Personalized travel itinerary generation</li>
          <li>Destination recommendations and information</li>
          <li>Travel planning tools and resources</li>
          <li>Community features for sharing travel experiences</li>
          <li>Integration with third-party services for bookings and information</li>
        </ul>
        <p>We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.</p>
      `
    },
    {
      icon: Scale,
      title: 'User Responsibilities',
      content: `
        <p>As a user of TripCraft, you agree to:</p>
        <ul>
          <li>Provide accurate and complete information when creating your account</li>
          <li>Maintain the security of your account credentials</li>
          <li>Use the service only for lawful purposes</li>
          <li>Respect the intellectual property rights of others</li>
          <li>Not attempt to interfere with or disrupt the service</li>
          <li>Not use the service to transmit harmful or malicious content</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
      `
    },
    {
      icon: CreditCard,
      title: 'Payment and Billing',
      content: `
        <p>For paid services, the following terms apply:</p>
        <ul>
          <li>Subscription fees are billed in advance on a monthly or annual basis</li>
          <li>All fees are non-refundable except as required by law</li>
          <li>We may change our pricing with 30 days' notice</li>
          <li>You are responsible for all taxes associated with your use of the service</li>
          <li>Payment processing is handled by secure third-party providers</li>
          <li>Failure to pay may result in suspension or termination of your account</li>
        </ul>
      `
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      content: `
        <p>TripCraft and its content are protected by intellectual property laws:</p>
        <ul>
          <li>The service and its original content are owned by TripCraft</li>
          <li>You retain ownership of content you create and share</li>
          <li>By sharing content, you grant us a license to use, display, and distribute it</li>
          <li>You may not copy, modify, or distribute our proprietary content</li>
          <li>Trademarks and logos are the property of their respective owners</li>
        </ul>
      `
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimers and Limitations',
      content: `
        <p>Important limitations on our liability:</p>
        <ul>
          <li>The service is provided "as is" without warranties of any kind</li>
          <li>We do not guarantee the accuracy of travel information or recommendations</li>
          <li>You are responsible for verifying all travel details and requirements</li>
          <li>We are not liable for any travel-related issues or expenses</li>
          <li>Our liability is limited to the amount you paid for the service</li>
          <li>We are not responsible for third-party services or content</li>
        </ul>
      `
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using TripCraft. By using our service, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 15, 2024
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to TripCraft! These Terms of Service ("Terms") govern your use of our AI-powered travel planning 
                platform and services. By creating an account or using our service, you agree to be bound by these Terms. 
                Please read them carefully.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3">
                      <section.icon className="h-5 w-5 text-white" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the service at our sole discretion, 
                without prior notice, for conduct that we believe violates these Terms or is harmful to other users, 
                us, or third parties, or for any other reason.
              </p>
              <p className="text-gray-700">
                You may terminate your account at any time by contacting us or using the account deletion feature 
                in your profile settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of 
                the service shall be resolved in the courts of San Francisco County, California.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of material changes 
                via email or through the service. Your continued use of the service after such modifications 
                constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                If you have any questions about these Terms of Service, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">legal@tripcraft.com</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium">Address:</span>
                  <span className="ml-2">123 Travel Street, San Francisco, CA 94102</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Effective Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 text-sm">
                These Terms of Service are effective as of January 15, 2024, and will remain in effect 
                except with respect to any changes in their provisions in the future, which will be in effect 
                immediately after being posted on this page.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms