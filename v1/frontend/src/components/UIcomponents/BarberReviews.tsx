import React, { useEffect, useState } from 'react';
import axiosClient from '@/api/axios';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  service_id?: number;
  service_name?: string;
  avatar?: string;
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

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [customerName, setCustomerName] = useState('');

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
        setError(err.response?.data?.message || err.message || 'Failed to fetch reviews');
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
      service_id: Number(selectedServiceId), // ✅ force convert to number
    };

    axiosClient
      .post(`/api/client/barbers/${barberId}/reviews`, payload)
      .then((response) => {
        setReviews([response.data, ...reviews]);
        setNewComment('');
        setNewRating(5);
        setSelectedServiceId('');
        setCustomerName('');
      })
      .catch((err) => {
        alert(err.response?.data?.message || err.message || 'Failed to submit review');
      });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Leave a Review</h3>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(Number(e.target.value))}
          className="flex-1 text-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Rating (1-5)"
          value={newRating}
          onChange={(e) => setNewRating(Number(e.target.value))}
        />
        <Button onClick={handleSubmitReview}>Submit Review</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-md bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{review.customerName}</div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
              {review.service_name && (
                <Badge variant="outline">{review.service_name}</Badge>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Posted on {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BarberReviews;
