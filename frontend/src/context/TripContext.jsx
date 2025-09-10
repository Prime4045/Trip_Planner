import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
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

const TripContext = createContext()

export const useTrip = () => {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}

export const TripProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
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
      console.log('Fetching trips from backend...')
      const response = await fetch('http://localhost:5000/api/trips', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const trips = await response.json()
      console.log('Trips fetched:', trips.length)
      setTrips(trips)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async (tripData) => {
    if (!user) return null

    setGenerating(true)
    try {
      console.log('Creating trip via backend API...')
      console.log('Trip data:', tripData)

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
        console.error('Backend error:', errorData)
        throw new Error(errorData.message || 'Failed to create trip')
      }

      const newTrip = await response.json()
      console.log('Trip created successfully:', newTrip._id)

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


  const getTripById = async (tripId) => {
    try {
      console.log('Fetching trip by ID:', tripId)
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const trip = await response.json()
      setCurrentTrip(trip)
      return trip
    } catch (error) {
      console.error('Error fetching trip:', error)
      return null
    }
  }

  const deleteTrip = async (tripId) => {
    try {
      console.log('Deleting trip:', tripId)
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setTrips(prev => prev.filter(trip => trip._id !== tripId))
      if (currentTrip?._id === tripId) {
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