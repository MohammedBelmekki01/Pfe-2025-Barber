"use client"

import { useState, useEffect } from "react"
import { Star, Heart, MessageCircle, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosClient from "@/api/axios"
import { useUsercontext } from "@/context/UserContext"

interface Review {
  id: number
  user_id: number
  barber_id: number
  displayName: string
  customerName: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  service: string
  avatar?: string
  likes?: number
  isLiked?: boolean
  replies?: number
  isVerified?: boolean
}

interface BarberReviewsProps {
  barberId: number
}

const BarberReviewsAdmin = ({ barberId }: BarberReviewsProps) => {
  const { user } = useUsercontext()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axiosClient
      .get(`/api/admin/barbers/${barberId}/reviews`)
      .then((response) => {
        setReviews(response.data)
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Échec du chargement des avis")
      })
      .finally(() => setLoading(false))
  }, [barberId])

  const toggleLike = (id: number) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              isLiked: !review.isLiked,
              likes: review.isLiked ? (review.likes || 0) - 1 : (review.likes || 0) + 1,
            }
          : review,
      ),
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffInSeconds < 60) return "à l’instant"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} j`
    return date.toLocaleDateString()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
    ))
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <div className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-b border-purple-200/30 dark:border-purple-800/30 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Avis clients</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">{renderStars(Math.round(averageRating))}</div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                {averageRating.toFixed(1)} sur 5
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({reviews.length} {reviews.length === 1 ? 'avis' : 'avis'})
              </span>
            </div>
          </div>
          <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{reviews.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total avis</div>
          </div>
        </div>
      </div>
      
      {/* Reviews List */}
      <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
        {loading && (
          <div className="p-8 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des avis...</p>
          </div>
        )}
        
        {error && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}
        
        {!loading &&
          !error &&
          (reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300">
                <div className="flex space-x-4">
                  <Avatar className="w-12 h-12 ring-2 ring-purple-200 dark:ring-purple-800 shadow-lg">
                    <AvatarImage
                      src={review.avatar || "/placeholder.svg?height=48&width=48"}
                      alt={review.displayName}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                      {review.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-bold text-gray-900 dark:text-white">{review.displayName}</span>
                      {review.isVerified && (
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                      <span className="text-gray-500 dark:text-gray-400 text-sm">@{review.customerName}</span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{formatTime(review.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                        {renderStars(review.rating)}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-0 shadow-sm"
                      >
                        {review.service}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                      "{review.comment}"
                    </p>
                    
                    <div className="flex items-center space-x-6 pt-2">
                      <button
                        onClick={() => toggleLike(review.id)}
                        className="flex items-center space-x-2 hover:text-red-500 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                          <Heart className={`w-4 h-4 ${review.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                        </div>
                        <span className="text-sm font-medium">{review.likes || 0}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">{review.replies || 0}</span>
                      </button>
                      
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="w-10 h-10 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Aucun avis pour l’instant</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Soyez le premier à partager votre expérience avec les services de ce barbier !
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BarberReviewsAdmin
