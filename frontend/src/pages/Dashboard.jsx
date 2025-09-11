import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'
import {
    Plus,
    MapPin,
    Calendar,
    DollarSign,
    Clock,
    Trash2,
    ExternalLink,
    TrendingUp,
    Users,
    Globe,
    Star,
    Eye,
    Edit,
    Share2
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/use-toast'

const Dashboard = () => {
    const { user } = useAuth()
    const { trips, loading, deleteTrip, fetchUserTrips } = useTrip()
    const { toast } = useToast()
    const [deletingTrip, setDeletingTrip] = useState(null)

    useEffect(() => {
        fetchUserTrips()
    }, [])

    const handleDeleteTrip = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip?')) return

        setDeletingTrip(tripId)
        try {
            await deleteTrip(tripId)
            toast({
                title: "Trip Deleted",
                description: "Your trip has been successfully deleted.",
            })
        } catch (error) {
            console.error('Delete error:', error)
            toast({
                title: "Error",
                description: "Failed to delete trip. Please try again.",
                variant: "destructive"
            })
        } finally {
            setDeletingTrip(null)
        }
    }

    const formatDate = (date) => {
        if (!date) return 'No date'
        const dateObj = date?.seconds ? new Date(date.seconds * 1000) : new Date(date)
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatCurrency = (amount) => {
        if (!amount) return '₹0'
        return `₹${amount.toLocaleString('en-IN')}`
    }

    const getDestinationImage = (destination) => {
        // Map destinations to beautiful images
        const imageMap = {
            'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
            'italy': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
            'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
            'japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
            'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
            'france': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
            'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
            'uk': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
            'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
            'usa': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
            'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
            'uae': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
            'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400',
            'thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
            'bangkok': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
            'bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
            'indonesia': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
            'maldives': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            'greece': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
            'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
            'istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400',
            'turkey': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400',
            'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
            'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
            'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400',
            'rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
            'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
            'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
        }

        const dest = destination.toLowerCase()
        for (const [key, image] of Object.entries(imageMap)) {
            if (dest.includes(key)) {
                return image
            }
        }

        // Default travel image
        return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
    }

    const getGradientClass = (index) => {
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-purple-500 to-pink-600',
            'from-green-500 to-blue-600',
            'from-orange-500 to-red-600',
            'from-teal-500 to-cyan-600',
            'from-indigo-500 to-purple-600'
        ]
        return gradients[index % gradients.length]
    }

    // Calculate user stats
    const totalTrips = trips.length
    const totalDays = trips.reduce((sum, trip) => sum + (trip.days || 0), 0)
    const totalSpent = trips.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0)
    const uniqueDestinations = new Set(trips.map(trip => trip.destination)).size

    if (loading) {
        return <LoadingSpinner message="Loading your trips..." />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-gray-600">
                                Ready to plan your next adventure?
                            </p>
                        </div>
                        <Button asChild className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Link to="/create-trip" className="flex items-center">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Trip
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Trips</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Globe className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Destinations</p>
                                    <p className="text-2xl font-bold text-gray-900">{uniqueDestinations}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Days Traveled</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* My Trips Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
                        {trips.length > 0 && (
                            <p className="text-gray-600">{trips.length} trip{trips.length !== 1 ? 's' : ''}</p>
                        )}
                    </div>

                    {trips.length === 0 ? (
                        <Card className="text-center py-16">
                            <CardContent>
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                                        <MapPin className="h-12 w-12 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No trips yet
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md">
                                        Start planning your first adventure! Our AI will help you create the perfect itinerary.
                                    </p>
                                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        <Link to="/create-trip" className="flex items-center">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Your First Trip
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip, index) => (
                                <motion.div
                                    key={trip._id || trip.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden card-hover group">
                                        {/* Trip Image Header */}
                                        <div className="relative h-48 overflow-hidden">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${getGradientClass(index)} opacity-90`} />
                                            <img
                                                src={getDestinationImage(trip.destination)}
                                                alt={trip.destination}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteTrip(trip._id || trip.id)}
                                                disabled={deletingTrip === (trip._id || trip.id)}
                                                className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                {deletingTrip === (trip._id || trip.id) ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>

                                            {/* Trip Title Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                                <h3 className="text-xl font-bold text-white mb-1">
                                                    {trip.fromLocation ? `${trip.fromLocation} → ` : ''}{trip.destination}
                                                </h3>
                                                <div className="flex items-center text-white/90 text-sm">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {trip.days} days • {formatCurrency(trip.totalBudget)}
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-6">
                                            {/* Trip Details */}
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Created {formatDate(trip.createdAt)}
                                                </div>

                                                <div className="flex items-center text-sm text-gray-600">
                                                    <DollarSign className="h-4 w-4 mr-2" />
                                                    Budget: {formatCurrency(trip.totalBudget)}
                                                </div>

                                                {trip.startDate && trip.endDate && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Preferences Tags */}
                                            {trip.preferences && trip.preferences.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {trip.preferences.slice(0, 3).map((pref, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {pref}
                                                        </Badge>
                                                    ))}
                                                    {trip.preferences.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{trip.preferences.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button asChild className="flex-1">
                                                    <Link to={`/trip/${trip._id || trip.id}`} className="flex items-center justify-center">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        View Trip
                                                    </Link>
                                                </Button>

                                                <Button variant="outline" size="sm" className="px-3">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                {trips.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12"
                    >
                        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <CardContent className="p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    Ready for your next adventure?
                                </h3>
                                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                    Let our AI help you discover new destinations and create amazing travel experiences.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                                        <Link to="/create-trip" className="flex items-center">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Plan New Trip
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                                        <Link to="/explore" className="flex items-center">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Explore Destinations
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Dashboard