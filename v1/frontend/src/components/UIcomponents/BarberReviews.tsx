import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Camera,
  Send,
  Sparkles,
  Verified,
  Clock,
  TrendingUp,
  Scissors,
} from "lucide-react";
import { useUsercontext } from "@/context/UserContext";

interface Review {
  id: number;
  user_id: number;
  barber_id: number;
  displayName: string;
  customerName: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  service_id?: number;
  service_name?: string;
  avatar?: string;
  likes?: number;
  isLiked?: boolean;
}

interface BarberReviewsProps {
  barberId: number;
}

const BarberReviews: React.FC<BarberReviewsProps> = ({ barberId }) => {
  const { user } = useUsercontext();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const currentUserId = user?.id;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch reviews
    axiosClient
      .get(`/api/client/barbers/${barberId}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch reviews"
        );
      })
      .finally(() => setLoading(false));

    // Fetch services
    axiosClient
      .get(`/api/barbers/${barberId}/services`)
      .then((response) => {
        setServices(response.data.data);
      })
      .catch(() => {
        setServices([]);
      });
  }, [barberId]);

  const handleSubmitReview = () => {
    if (!newComment.trim() || !selectedServiceId) return;

    const payload = {
      user_id: currentUserId,
      rating: newRating,
      comment: newComment,
      service_id: Number(selectedServiceId),
    };

    axiosClient
      .post(`/api/client/barbers/${barberId}/reviews`, payload)
      .then((response) => {
        setReviews([response.data, ...reviews]);
        setNewComment("");
        setNewRating(5);
        setSelectedServiceId("");
        setShowReviewForm(false);
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            err.message ||
            "Failed to submit review"
        );
      });
  };

  const handleLikeReview = (reviewId: number) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              likes: (review.likes || 0) + (review.isLiked ? -1 : 1),
              isLiked: !review.isLiked,
            }
          : review
      )
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold text-lg">4.8</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{reviews.length} reviews</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Write Review
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Share Your Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Let others know how it went!
                  </p>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                  className="w-full p-4 border-0 bg-gray-100 dark:bg-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  <option value="">Choose the service you experienced</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newRating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {newRating}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Your Review
                </label>
                <Textarea
                  placeholder="Tell us about your experience... What did you love? Any suggestions?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[120px] border-0 bg-gray-100 dark:bg-gray-700 rounded-2xl resize-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={!newComment.trim() || !selectedServiceId}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-2xl py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <Send className="w-5 h-5 mr-2" />
                Share Your Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card
              key={review.id}
              className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold">
                      {getInitials(review.customerName || user?.firstname || "User")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {review.customerName || user?.name}
                        </h4>
                        <Verified className="w-4 h-4 text-emerald-500" />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(review.created_at)}
                      </div>
                    </div>

                    {/* Service Badge */}
                    {review.service_name && (
                      <Badge className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 dark:from-emerald-900/30 dark:to-blue-900/30 dark:text-emerald-300 border-0 rounded-full">
                        <Scissors className="w-3 h-3 mr-1" />
                        {review.service_name}
                      </Badge>
                    )}

                    {/* Comment */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-2">
                      <button
                        onClick={() => handleLikeReview(review.id)}
                        className="flex items-center gap-2 group/like hover:scale-105 transition-all duration-200"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors duration-200 ${
                            review.isLiked
                              ? "text-red-500 fill-current"
                              : "text-gray-400 group-hover/like:text-red-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {review.likes || 0}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 group/share hover:scale-105 transition-all duration-200">
                        <Share2 className="w-5 h-5 text-gray-400 group-hover/share:text-emerald-500 transition-colors duration-200" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Share
                        </span>
                      </button>

                      <button className="flex items-center gap-2 group/thumbs hover:scale-105 transition-all duration-200">
                        <ThumbsUp className="w-5 h-5 text-gray-400 group-hover/thumbs:text-blue-500 transition-colors duration-200" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Helpful
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BarberReviews;
