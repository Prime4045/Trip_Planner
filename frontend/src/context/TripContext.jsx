import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { generateItinerary } from '../services/geminiService'
import { getPlaceDetails, getPlacePhotos } from '../services/placesService'

const TripContext = createContext()

export const useTrip = () => {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}

export const TripProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0()
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserTrips()
    }
  }, [isAuthenticated, user])

  const fetchUserTrips = async () => {
    if (!user) return

    setLoading(true)
    try {
      const tripsRef = collection(db, 'trips')
      const q = query(
        tripsRef, 
        where('userId', '==', user.sub),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const userTrips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTrips(userTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async (tripData) => {
    if (!user) return null

    setGenerating(true)
    try {
      // Save trip to Firestore with user data
      const tripDoc = {
        userId: user.sub,
        destination: tripData.destination,
        days: tripData.days,
        budget: tripData.budget,
        preferences: tripData.preferences,
        itinerary: null, // Will be populated by backend
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Call backend to create trip with AI generation
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(tripData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create trip')
      }

      const newTrip = await response.json()
      
      setTrips(prev => [newTrip, ...prev])
      setCurrentTrip(newTrip)
      
      return newTrip
    } catch (error) {
      console.error('Error creating trip:', error)
      throw error
    } finally {
      setGenerating(false)
    }
  }

  const enrichItineraryWithPlaces = async (itinerary) => {
    const enrichedDays = await Promise.all(
      itinerary.days.map(async (day) => {
        const enrichedActivities = await Promise.all(
          day.activities.map(async (activity) => {
            try {
              const placeDetails = await getPlaceDetails(activity.name, itinerary.destination)
              const photos = await getPlacePhotos(placeDetails?.place_id)
              
              return {
                ...activity,
                placeId: placeDetails?.place_id,
                rating: placeDetails?.rating,
                address: placeDetails?.formatted_address,
                photos: photos,
                googleMapsUrl: placeDetails?.place_id 
                  ? `https://www.google.com/maps/place/?q=place_id:${placeDetails.place_id}`
                  : `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`
              }
            } catch (error) {
              console.error('Error enriching activity:', error)
              return {
                ...activity,
                googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`
              }
            }
          })
        )
        
        return {
          ...day,
          activities: enrichedActivities
        }
      })
    )

    return {
      ...itinerary,
      days: enrichedDays
    }
  }

  const getTripById = async (tripId) => {
    try {
      const tripRef = doc(db, 'trips', tripId)
      const tripSnap = await getDoc(tripRef)
      
      if (tripSnap.exists()) {
        const trip = { id: tripSnap.id, ...tripSnap.data() }
        setCurrentTrip(trip)
        return trip
      }
      return null
    } catch (error) {
      console.error('Error fetching trip:', error)
      return null
    }
  }

  const deleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, 'trips', tripId))
      setTrips(prev => prev.filter(trip => trip.id !== tripId))
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null)
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      throw error
    }
  }

  const value = {
    trips,
    currentTrip,
    loading,
    generating,
    createTrip,
    getTripById,
    deleteTrip,
    fetchUserTrips,
    setCurrentTrip
  }

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  )
}