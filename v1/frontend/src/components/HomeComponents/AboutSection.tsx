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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Notre Équipe
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nos Barbiers Experts
            </h2>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des barbiers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Notre Équipe
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nos Barbiers Experts
            </h2>
          </div>
          <div className="text-center text-red-500 mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (barbersWithServices.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
              <Award className="w-4 h-4 mr-2" />
              Notre Équipe
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nos Barbiers Experts
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucun barbier disponible pour le moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Award className="w-4 h-4 mr-2" />
            Notre Équipe
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos Barbiers Experts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rencontrez notre équipe de barbiers professionnels, chacun avec son
            expertise unique et ses spécialités.
          </p>
        </div>

        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {barbersWithServices.map((barberData) => (
                <CarouselItem
                  key={barberData.barber.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 shadow-lg bg-white dark:bg-gray-800">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Barber Info */}
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <span className="text-xl font-bold text-white">
                            {barberData.barber.firstname.charAt(0)}
                            {barberData.barber.lastname.charAt(0)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">
                          {barberData.barber.firstname}{" "}
                          {barberData.barber.lastname}
                        </h3>
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-3">
                          Barbier Professionnel
                        </p>

                        <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-emerald-600" />
                            <span className="truncate max-w-20">
                              {barberData.barber.experience}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span className="truncate max-w-20">
                              {barberData.barber.location}
                            </span>
                          </div>
                        </div>

                        {barberData.barber.bio && (
                          <p className="text-sm text-muted-foreground italic line-clamp-2">
                            "{barberData.barber.bio}"
                          </p>
                        )}
                      </div>

                      {/* Services */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                            Services ({barberData.services.length})
                          </div>
                        </div>

                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {barberData.services.slice(0, 3).map((service) => (
                            <div
                              key={service.id}
                              className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-foreground text-sm">
                                  {service.name}
                                </h5>
                                <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded font-medium">
                                  {service.price} MAD
                                </span>
                              </div>

                              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                {service.description}
                              </p>

                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">
                                  {service.duration} min
                                </span>
                              </div>
                            </div>
                          ))}
                          {barberData.services.length > 3 && (
                            <div className="text-center text-xs text-muted-foreground">
                              +{barberData.services.length - 3} autres services
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="space-y-2 text-xs text-muted-foreground">
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
                        </div>
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
      </div>
    </section>
  );
}
