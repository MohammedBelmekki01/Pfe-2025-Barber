"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axiosClient from "@/api/axios";

interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  location: string;
  profile_photo: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  image?: string;
  barber?: Barber;
}

export function ServicesCarousel() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Note: Changed from POST to GET as this should be a GET request to fetch services
        const response = await axiosClient.get("/api/services");
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
        setServices(response.data.data || response.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");

        // Fallback to mock data on error
        const mockServices: Service[] = [
          {
            id: 1,
            name: "Coupe Classique",
            price: 35,
            duration: 45,
            description: "Une coupe moderne avec finition professionnelle.",
            image: undefined,
          },
          {
            id: 2,
            name: "Rasage Traditionnel",
            price: 20,
            duration: 30,
            description: "Rasage doux avec serviette chaude.",
            image: undefined,
          },
        ];
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Nos Services
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Services Professionnels
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre gamme complète de services de barbier professionnels
            avec des tarifs transparents.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des services...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p>{error}</p>
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucun service disponible pour le moment.
            </p>
          </div>
        )}

        {!loading && services.length > 0 && (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {services.map((service) => (
                  <CarouselItem
                    key={service.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 shadow-lg bg-white dark:bg-gray-800">
                      <CardContent className="p-6 h-full flex flex-col">
                        {/* Service Image */}
                        {service.image && (
                          <div className="mb-4 overflow-hidden rounded-lg">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/storage/${service.image}`}
                              alt={service.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {service.description}
                          </p>

                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-emerald-600" />
                              <span>{service.duration} min</span>
                            </div>
                            {service.barber && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <span className="truncate max-w-20">
                                  {service.barber.location}
                                </span>
                              </div>
                            )}
                          </div>

                          {service.barber && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Barbier:{" "}
                              </span>
                              <span className="text-foreground font-medium">
                                {service.barber.firstname}{" "}
                                {service.barber.lastname}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300 group">
                            <Calendar className="w-4 h-4 mr-2" />
                            Réserver pour {service.price} MAD
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors" />
              <CarouselNext className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}