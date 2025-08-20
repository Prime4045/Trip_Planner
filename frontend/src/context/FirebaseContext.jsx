import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const FirebaseContext = createContext()

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

export const FirebaseProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      syncUserToFirestore()
    }
  }, [isAuthenticated, user])

  const syncUserToFirestore = async () => {
    if (!user) return

    setLoading(true)
    try {
      const userRef = doc(db, 'users', user.sub)
      const userSnap = await getDoc(userRef)

      const userData = {
        id: user.sub,
        name: user.name,
        email: user.email,
        avatar: user.picture,
        createdAt: userSnap.exists() ? userSnap.data().createdAt : new Date(),
        lastLogin: new Date()
      }

      await setDoc(userRef, userData, { merge: true })
      setUserProfile(userData)
    } catch (error) {
      console.error('Error syncing user to Firestore:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    userProfile,
    loading,
    syncUserToFirestore
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}