import { useEffect, useState } from "react";
import { Award, Clock, MapPin } from "lucide-react";

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
  date_of_birth: string;
  gender: string;
  addrees: string;
  phone: string;
  email: string;
  bio: string;
  experience: string;
  location: string;
  status: string;
  role: string;
}

interface Service {
  id: number;
  barber_id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  image: string;
  barber: Barber;
}

interface ApiResponse {
  data: Service[];
}

export function BarberCarousel() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group services by barber
  const groupedByBarber = services.reduce((acc, service) => {
    const barberId = service.barber.id;
    if (!acc[barberId]) {
      acc[barberId] = {
        barber: service.barber,
        services: [],
      };
    }
    acc[barberId].services.push(service);
    return acc;
  }, {} as Record<number, { barber: Barber; services: Service[] }>);

  const barbersWithServices = Object.values(groupedByBarber);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosClient.get<ApiResponse>("/api/services");
        setServices(response.data.data || []);
      } catch (err: unknown) {
        console.error("Error fetching services:", err);
        const error = err as { response?: { data?: { message?: string } } };
        setError(
          `Failed to load services: ${
            error.response?.data?.message || "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Nos Barbiers
        </h2>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Chargement des barbiers...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Nos Barbiers
        </h2>
        <div className="text-center text-red-500 dark:text-red-400">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (barbersWithServices.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Nos Barbiers
        </h2>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Aucun barbier disponible pour le moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Nos Barbiers & Services
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Découvrez notre équipe de barbiers professionnels et leurs services
        </p>

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {barbersWithServices.map((barberData) => (
              <CarouselItem
                key={barberData.barber.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow duration-300">
                  <CardContent className="p-6">
                    {/* Barber Info */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {barberData.barber.firstname.charAt(0)}
                          {barberData.barber.lastname.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {barberData.barber.firstname}{" "}
                        {barberData.barber.lastname}
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-3">
                        Barbier Professionnel
                      </p>

                      <div className="flex justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{barberData.barber.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{barberData.barber.location}</span>
                        </div>
                      </div>

                      {barberData.barber.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                          "{barberData.barber.bio}"
                        </p>
                      )}
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Services ({barberData.services.length})
                        </h4>
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {barberData.services.map((service) => (
                          <div
                            key={service.id}
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {service.name}
                              </h5>
                              <span className="bg-emerald-500 dark:bg-emerald-600 text-white text-xs px-2 py-1 rounded font-medium">
                                {service.price} MAD
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {service.description}
                            </p>

                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {service.duration} min
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span className="truncate">
                            {barberData.barber.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span>{barberData.barber.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span className="truncate">
                            {barberData.barber.addrees}
                          </span>
                        </div>
                      </div>
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
    </section>
  );
}
