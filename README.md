# 🌍 AI Trip Planner

A full-stack AI-powered trip planning application that creates personalized travel itineraries using Google Gemini AI, with Auth0 authentication, Firebase integration, and Google Places API.

## ✨ Features

- **🤖 AI-Powered Itineraries**: Generate detailed day-by-day travel plans using Google Gemini AI
- **🔐 Secure Authentication**: Auth0 integration with Google OAuth support
- **🗺️ Real Place Data**: Google Places API integration with photos and ratings
- **💾 Cloud Storage**: Firebase Firestore for real-time data synchronization
- **📱 Responsive Design**: Beautiful, mobile-first UI with Tailwind CSS
- **🎨 Modern UI Components**: ShadCN UI components with smooth animations
- **📊 Trip Analytics**: Personal travel statistics and insights
- **🌐 Google Maps Integration**: Direct navigation links to all locations

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS + ShadCN UI components
- **Authentication**: Auth0 React SDK
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API
- **Maps**: Google Places API + Google Maps links
- **Animations**: Framer Motion

### Backend (Node.js + Express)
- **Framework**: Express.js with MongoDB
- **Authentication**: JWT + Auth0 integration
- **AI Service**: Google Gemini API integration
- **Places Service**: Google Places API wrapper
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express Validator

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Auth0 account
- Google Cloud account (for Gemini AI and Places API)
- Firebase project

### 1. Clone and Install
```bash
git clone <repository-url>
cd ai-trip-planner

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Environment Setup

**Frontend (.env)**:
```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/tripplanner
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

### 3. API Keys Setup

#### Auth0 Setup
1. Create Auth0 application
2. Enable Google social connection
3. Configure callback URLs: `http://localhost:3000`
4. Get Domain and Client ID

#### Firebase Setup
1. Create Firebase project
2. Enable Firestore database
3. Get configuration object
4. Set up security rules

#### Google Cloud Setup
1. Enable Gemini AI API
2. Enable Places API
3. Create API keys
4. Set up billing (required for Places API)

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Frontend (http://localhost:3000)
cd frontend && npm run dev

# Backend (http://localhost:5000)
cd backend && npm run dev
```

## 📁 Project Structure

```
ai-trip-planner/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── server.js           # Entry point
└── package.json            # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Trips
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Places
- `GET /api/places/search` - Search places
- `GET /api/places/details/:placeId` - Get place details
- `GET /api/places/photos/:placeId` - Get place photos

## 🎨 UI Components

Built with ShadCN UI components:
- **Cards**: Trip displays and information panels
- **Forms**: Trip creation and user preferences
- **Navigation**: Header with dropdown menus
- **Feedback**: Toast notifications and loading states
- **Data Display**: Tables, badges, and statistics

## 🔒 Security Features

- **Authentication**: Auth0 with Google OAuth
- **Authorization**: JWT tokens with middleware protection
- **Input Validation**: Express Validator for all inputs
- **Rate Limiting**: API endpoint protection
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers

## 📱 Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-friendly**: Large tap targets and gestures
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React, Node.js, and AI**