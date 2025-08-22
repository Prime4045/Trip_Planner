import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FirebaseProvider } from './context/FirebaseContext'
import Login from "./pages/Login"; // 
import { TripProvider } from './context/TripContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import TripDetail from './pages/TripDetail'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Community from './pages/Community'
import About from './pages/About'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Help from './pages/Help'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import LoadingSpinner from './components/LoadingSpinner'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <AuthProvider>
      <FirebaseProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </FirebaseProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/create-trip"
              element={isAuthenticated ? <CreateTrip /> : <Navigate to="/" />}
            />
            <Route
              path="/trip/:id"
              element={isAuthenticated ? <TripDetail /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  )
}

export default App