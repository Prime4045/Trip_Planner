import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `
        <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
        <h4>Personal Information:</h4>
        <ul>
          <li>Name and email address</li>
          <li>Profile information and preferences</li>
          <li>Travel itineraries and trip data</li>
          <li>Payment information (processed securely by third parties)</li>
        </ul>
        <h4>Automatically Collected Information:</h4>
        <ul>
          <li>Device information and IP address</li>
          <li>Usage data and analytics</li>
          <li>Cookies and similar technologies</li>
        </ul>
      `
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `
        <p>We use the information we collect to provide, maintain, and improve our services:</p>
        <ul>
          <li>Generate personalized travel recommendations</li>
          <li>Process transactions and send confirmations</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Send important updates about our services</li>
          <li>Improve our AI algorithms and user experience</li>
          <li>Ensure security and prevent fraud</li>
        </ul>
      `
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: `
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
        <ul>
          <li><strong>Service Providers:</strong> With trusted partners who help us operate our services</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>Consent:</strong> With your explicit permission</li>
        </ul>
      `
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `
        <p>We implement appropriate security measures to protect your personal information:</p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security audits and assessments</li>
          <li>Access controls and authentication measures</li>
          <li>Secure data centers and infrastructure</li>
          <li>Employee training on data protection</li>
        </ul>
        <p>While we strive to protect your information, no method of transmission over the internet is 100% secure.</p>
      `
    },
    {
      icon: Globe,
      title: 'International Transfers',
      content: `
        <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:</p>
        <ul>
          <li>Compliance with applicable data protection laws</li>
          <li>Standard contractual clauses for international transfers</li>
          <li>Adequacy decisions by relevant authorities</li>
          <li>Your consent where required</li>
        </ul>
      `
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: `
        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal information</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Portability:</strong> Receive your data in a portable format</li>
          <li><strong>Objection:</strong> Object to certain processing activities</li>
          <li><strong>Restriction:</strong> Request restriction of processing</li>
        </ul>
        <p>To exercise these rights, please contact us at privacy@tripcraft.com</p>
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
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                At TripCraft, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                AI-powered trip planning service.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
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

        {/* Cookies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                  <p className="text-sm text-gray-600">Required for basic site functionality and security.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how you use our service to improve it.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Preference Cookies</h4>
                  <p className="text-sm text-gray-600">Remember your settings and personalize your experience.</p>
                </div>
              </div>
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
                Questions About Privacy?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy or our data practices, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">privacy@tripcraft.com</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium">Address:</span>
                  <span className="ml-2">123 Travel Street, San Francisco, CA 94102</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Updates Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Changes to This Policy</h3>
              <p className="text-gray-600 text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of our service after any changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy