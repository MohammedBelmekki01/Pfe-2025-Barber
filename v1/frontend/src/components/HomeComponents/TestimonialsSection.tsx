"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import axiosClient from "@/api/axios";

// Types for the API response
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  addrees: string;
  phone: string;
  deleted_at: string | null;
  role: string;
}

interface Review {
  id: number;
  user_id: number;
  customerName: string | null;
  barber_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  service_id: number | null;
  user: User;
  service: string | null;
}

interface ApiResponse {
  data: Review[];
}

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosClient.get<ApiResponse>("/api/allreview");
        const reviewsData = response.data.data || [];

        // Filter reviews with valid ratings and comments
        const validReviews = reviewsData.filter(
          (review) =>
            review.rating > 0 && review.comment && review.comment.trim() !== ""
        );

        setReviews(validReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");

        // Fallback to mock data
        const mockReviews: Review[] = [
          {
            id: 1,
            user_id: 1,
            customerName: null,
            barber_id: 1,
            rating: 5,
            comment:
              "Service exceptionnel ! Le barbier a su comprendre exactement ce que je voulais. Je recommande vivement !",
            created_at: "2025-09-01T10:00:00Z",
            updated_at: "2025-09-01T10:00:00Z",
            service_id: null,
            user: {
              id: 1,
              name: "Pierre Dubois",
              email: "pierre@example.com",
              email_verified_at: null,
              created_at: "2025-01-01T00:00:00Z",
              updated_at: "2025-01-01T00:00:00Z",
              addrees: "Paris, France",
              phone: "0123456789",
              deleted_at: null,
              role: "client",
            },
            service: null,
          },
        ];
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (reviews.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [reviews.length]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffInDays / 30)} mois`;
  };

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-400 dark:text-yellow-300 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Star className="w-4 h-4 mr-2" />
            Témoignages
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            La satisfaction de nos clients est notre priorité. Découvrez leurs
            expériences avec nos services.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des avis...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center text-red-500 mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p>{error}</p>
          </div>
        )}

        {/* No Reviews */}
        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-12">
            <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Aucun avis disponible pour le moment.
            </p>
            <p className="text-muted-foreground">
              Soyez le premier à laisser un avis !
            </p>
          </div>
        )}

        {/* Testimonial Carousel */}
        {!loading && reviews.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/50 dark:to-blue-950/50 border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <Quote className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-6" />

                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {renderStars(reviews[currentTestimonial].rating)}
                  </div>
                  <p className="text-xl text-foreground italic mb-6 leading-relaxed">
                    "{reviews[currentTestimonial].comment}"
                  </p>
                </div>

                <div className="border-t border-emerald-200 dark:border-emerald-800 pt-6">
                  <h4 className="font-semibold text-foreground text-lg">
                    {reviews[currentTestimonial].user.name}
                  </h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Client Satisfait
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(reviews[currentTestimonial].created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dots Navigation */}
            {reviews.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-colors hover:scale-110 transform ${
                      currentTestimonial === idx
                        ? "bg-emerald-600 dark:bg-emerald-400"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    onClick={() => setCurrentTestimonial(idx)}
                    aria-label={`Voir l'avis ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Statistics */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {reviews.length}
                </div>
                <div className="text-muted-foreground">Avis clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {reviews.length > 0
                    ? (
                        reviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                        ) / reviews.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-muted-foreground">Note moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {reviews.filter((review) => review.rating === 5).length}
                </div>
                <div className="text-muted-foreground">Avis 5 étoiles</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
