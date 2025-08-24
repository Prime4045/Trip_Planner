const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const { auth, requiresAuth } = require('express-openid-connect')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a-long-randomly-generated-string-stored-in-env',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    login: false,  // We'll handle this manually
    logout: false, // We'll handle this manually
    callback: '/auth/callback'
  }
}

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tripplanner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

// Import models
const User = require('./models/User')

// Middleware to sync user with database
const syncUserToDatabase = async (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    try {
      const authUser = req.oidc.user
      
      // Check if user exists in database
      let user = await User.findOne({ auth0Id: authUser.sub })
      
      if (!user) {
        // Create new user
        user = new User({
          auth0Id: authUser.sub,
          name: authUser.name,
          email: authUser.email,
          avatar: authUser.picture,
          createdAt: new Date(),
          lastLogin: new Date()
        })
        await user.save()
        console.log('New user created:', user.email)
      } else {
        // Update last login
        user.lastLogin = new Date()
        await user.save()
      }
      
      // Attach user to request
      req.user = user
    } catch (error) {
      console.error('Error syncing user to database:', error)
    }
  }
  next()
}

// Apply user sync middleware to all routes
app.use(syncUserToDatabase)

// Auth status endpoint
app.get('/api/auth/status', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    console.log('User authenticated:', req.user)
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        auth0Id: req.user.auth0Id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin,
        preferences: req.user.preferences || {}
      }
    })
  } else {
    console.log('User not authenticated')
    res.json({ isAuthenticated: false })
  }
})

// Protected user profile endpoint
app.get('/api/user/profile', requiresAuth(), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ message: 'Server error fetching profile' })
  }
})

// Update user profile
app.put('/api/user/profile', requiresAuth(), async (req, res) => {
  try {
    const { preferences } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          preferences,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-__v')

    res.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error updating profile' })
  }
})

// Routes
app.use('/api/trips', require('./routes/trips'))
app.use('/api/destinations', require('./routes/destinations'))
app.use('/api/places', require('./routes/places'))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    auth: req.oidc.isAuthenticated() ? 'authenticated' : 'not authenticated'
  })
})

// Frontend auth redirect endpoints
app.get('/auth/login', (req, res) => {
  res.oidc.login({
    returnTo: (process.env.FRONTEND_URL || 'http://localhost:3000') + '/dashboard'
  })
})

app.get('/auth/logout', (req, res) => {
  res.oidc.logout({
    returnTo: process.env.FRONTEND_URL || 'http://localhost:3000'
  })
})

// Handle successful login callback
app.get('/auth/callback', (req, res) => {
  // User is now authenticated, redirect to frontend dashboard
  res.redirect((process.env.FRONTEND_URL || 'http://localhost:3000') + '/dashboard')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Auth0 configured: ${config.issuerBaseURL ? 'Yes' : 'No'}`)
})