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
        console.log('====================================');
        console.log(response.data);
        console.log('====================================');
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
    <section className="py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Nos Services</h2>

      {loading && (
        <div className="text-center">
          <p>Chargement des services...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="text-center">
          <p>Aucun service disponible pour le moment.</p>
        </div>
      )}

      {!loading && services.length > 0 && (
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-4">
            {services.map((service) => (
              <CarouselItem
                key={service.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Service Image */}
                    {service.image && (
                      <div className="mb-3">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/storage/${
                            service.image
                          }`}
                          alt={service.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="mb-3 space-y-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} min</span>
                      </div>
                      {service.barber && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{service.barber.location}</span>
                        </div>
                      )}
                    </div>

                    {service.barber && (
                      <div className="mb-4 text-sm">
                        Barbier:{" "}
                        <span className="text-foreground font-medium">
                          {service.barber.firstname} {service.barber.lastname}
                        </span>
                      </div>
                    )}

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Réserver pour {service.price} MAD
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
}
