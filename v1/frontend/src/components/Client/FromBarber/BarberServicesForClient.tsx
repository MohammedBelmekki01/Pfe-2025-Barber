import { useEffect, useState } from "react";
import { Clock, MapPin, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  image: string;
  barber: Barber;
}

export default function BarberServicesForClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get("/api/client/services");
        setServices(response.data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Chargement des services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Aucun service disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Services Disponibles
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Découvrez tous nos services professionnels
        </p>

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {services.map((service) => (
              <CarouselItem
                key={service.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow duration-300">
                  <CardContent className="p-6">
                    {/* Service Image */}
                    {service.image && (
                      <div className="mb-4">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/storage/${
                            service.image
                          }`}
                          alt={service.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Service Info */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      {/* Service Details */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {service.duration} min
                          </span>
                        </div>
                        <div className="bg-emerald-500 dark:bg-emerald-600 text-white px-3 py-1 rounded-full">
                          <span className="text-sm font-semibold">
                            {service.price} MAD
                          </span>
                        </div>
                      </div>

                      {/* Barber Info */}
                      {service.barber && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {service.barber.firstname} {service.barber.lastname}
                          </span>
                          {service.barber.location && (
                            <>
                              <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {service.barber.location}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" />
          <CarouselNext className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" />
        </Carousel>
      </div>
    </div>
  );
}
