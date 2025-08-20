import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { FirebaseProvider } from './context/FirebaseContext'
import { TripProvider } from './context/TripContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import TripDetail from './pages/TripDetail'
import Profile from './pages/Profile'
import LoadingSpinner from './components/LoadingSpinner'
import { Toaster } from './components/ui/toaster'

function App() {
  const { isLoading, isAuthenticated } = useAuth0()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <FirebaseProvider>
      <TripProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
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
      </TripProvider>
    </FirebaseProvider>
  )
}

export default App