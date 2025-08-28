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
        setError(err.response?.data?.message || err.message || "Failed to fetch reviews")
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
    if (diffInSeconds < 60) return "now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
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
    <div className="max-w-2xl mx-auto bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Reviews</h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">{renderStars(Math.round(averageRating))}</div>
              <span className="text-sm font-medium text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{reviews.length}</div>
            <div className="text-xs text-muted-foreground">Total reviews</div>
          </div>
        </div>
      </div>
      {/* Reviews List */}
      <div className="divide-y divide-border">
        {loading && <p className="p-4 text-center text-muted-foreground">Loading reviews...</p>}
        {error && <p className="p-4 text-center text-destructive">{error}</p>}
        {!loading &&
          !error &&
          (reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10 ring-2 ring-border">
                    <AvatarImage
                      src={review.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={review.displayName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {review.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-foreground text-sm">{review.displayName}</span>
                      {review.isVerified && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-muted-foreground text-xs">@{review.customerName}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">{formatTime(review.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {review.service}
                      </Badge>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-3">{review.comment}</p>
                    <div className="flex items-center space-x-6 text-muted-foreground">
                      <button
                        onClick={() => toggleLike(review.id)}
                        className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${review.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="text-xs font-medium">{review.likes || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{review.replies || 0}</span>
                      </button>
                      <button className="p-1 hover:bg-accent rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
              <p className="text-muted-foreground text-sm">Be the first to share your experience!</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BarberReviewsAdmin
