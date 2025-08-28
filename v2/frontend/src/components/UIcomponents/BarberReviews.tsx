import { useState, useEffect } from 'react';
import { Star, Heart, MessageCircle, Send, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import axiosClient from '@/api/axios';
import { useUsercontext } from '@/context/UserContext';

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
  service: string;
  avatar?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: number;
  isVerified?: boolean;
}

interface BarberReviewsProps {
  barberId: number;
}

const BarberReviews = ({ barberId }: BarberReviewsProps) => {
    const {user} = useUsercontext()
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newService, setNewService] = useState('');
  const [customerName, setCustomerName] = useState('');
  const currentUserId = user?.id

  useEffect(() => {
    setLoading(true);
    setError(null);

    axiosClient
      .get(`/api/client/barbers/${barberId}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to fetch reviews');
      })
      .finally(() => setLoading(false));
  }, [barberId]);

  const handleSubmitReview = () => {
    if (!newComment.trim() || !newService.trim() || !customerName.trim()) return;

    const payload = {
      user_id: currentUserId,
      rating: newRating,
      comment: newComment,
      service: newService,
      customerName: customerName,
    };

    axiosClient
      .post(`/api/client/barbers/${barberId}/reviews`, payload)
      .then((response) => {
        setReviews([response.data, ...reviews]);
        setNewComment('');
        setNewRating(5);
        setNewService('');
        setCustomerName('');
      })
      .catch((err) => {
        alert(err.response?.data?.message || err.message || 'Failed to submit review');
      });
  };

  const toggleLike = (id: number) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              isLiked: !review.isLiked,
              likes: review.isLiked ? (review.likes || 0) - 1 : (review.likes || 0) + 1,
            }
          : review
      )
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderStarSelector = (
    rating: number,
    setRating: React.Dispatch<React.SetStateAction<number>>
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
<div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
  {/* Header */}
  <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center space-x-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900 dark:text-white">{reviews.length}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Total reviews</div>
      </div>
    </div>
  </div>

  {/* Add Review Section */}
  <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Input
          placeholder="Your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="flex-1 text-sm"
        />
        <Input
          placeholder="Service (e.g., Fade, Beard trim)"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          className="flex-1 text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Rating:</span>
        <div className="flex items-center space-x-1">
          {renderStarSelector(newRating, setNewRating)}
        </div>
      </div>

      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            placeholder="Add a review... share your experience! 💯"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] text-sm resize-none border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <Button
          onClick={handleSubmitReview}
          disabled={!newComment.trim() || !customerName.trim() || !newService.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>

  {/* Reviews List */}
  <div className="divide-y divide-gray-100 dark:divide-gray-800">
    {loading && <p className="p-4 text-center text-gray-500 dark:text-gray-400">Loading reviews...</p>}
    {error && <p className="p-4 text-center text-red-500 dark:text-red-400">{error}</p>}

    {!loading &&
      !error &&
      (reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex space-x-3">
              <Avatar className="w-10 h-10 ring-2 ring-gray-100 dark:ring-gray-700">
                <AvatarImage src={review.avatar || "/api/placeholder/40/40"} alt={review.displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {review.displayName.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {review.displayName}
                  </span>
                  {review.isVerified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 text-xs">@{review.customerName}</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">{formatTime(review.created_at)}</span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {review.service}
                  </Badge>
                </div>

                <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed mb-3">
                  {review.comment}
                </p>

                <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => toggleLike(review.id)}
                    className="flex items-center space-x-2 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${review.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-xs font-medium">{review.likes || 0}</span>
                  </button>

                  <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{review.replies || 0}</span>
                  </button>

                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 px-4">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to share your experience!</p>
        </div>
      ))}
  </div>
</div>

  );
};

export default BarberReviews;
