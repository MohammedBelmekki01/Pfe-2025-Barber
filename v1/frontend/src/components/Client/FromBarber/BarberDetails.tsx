"use client";

import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Award,
  FileText,
  User,
  Scissors,
  CircleDot,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format, differenceInYears } from "date-fns";
import BarberReviews from "@/components/UIcomponents/BarberReviews";
import ReservationForm from "../ForReservationClient/ReservationForm";
import BarberScheduleDisplay from "./BarberSchedule";

// Define the Service type
export type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  category?: string;
  popular?: boolean;
};

// Updated Barber type with services
export type Barber = {
  id: number;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: "m" | "f";
  address: string;
  phone: string;
  email: string;
  bio: string;
  experience: string;
  location: string;
  email_verified_at: string | null;
  formatted_updated_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  services?: Service[];
  avatar?: string;
  rating?: number;
  total_reviews?: number;
  specialties?: string[];
};

interface BarberDetailsProps {
  barber: Barber;
}

export default function BarberDetails({ barber }: BarberDetailsProps) {
  if (!barber) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
        <div className="text-center space-y-2">
          <User className="w-12 h-12 mx-auto opacity-50" />
          <p className="text-lg font-medium">Aucune donnée barbier disponible</p>
          <p className="text-sm">Veuillez réessayer plus tard</p>
        </div>
      </div>
    );
  }

  // Calcul de l'âge
  const age = barber.date_of_birth
    ? differenceInYears(new Date(), new Date(barber.date_of_birth))
    : null;

  // Initiales pour l'avatar
  const initials = `${barber.firstname.charAt(0)}${barber.lastname.charAt(0)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Carte Profil Header */}
        <Card className="relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10" />

          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/${barber?.image}` || "/placeholder.svg"}
                    alt={`${barber.firstname} ${barber.lastname}`}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {barber.email_verified_at && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Infos de base */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {barber.firstname} {barber.lastname}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    Barbier professionnel
                  </p>

                  {/* Note et avis */}
                  {barber.rating && (
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(barber.rating!)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">
                        {barber.rating}
                      </span>
                      {barber.total_reviews && (
                        <span className="text-gray-500">
                          ({barber.total_reviews} avis)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spécialités */}
                  {barber.specialties && barber.specialties.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {barber.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact rapide */}
              <div className="flex flex-col gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler maintenant
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Infos personnelles & pro */}
          <div className="lg:col-span-2 space-y-6">
            {/* Infos personnelles */}
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-base font-medium">{barber.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Téléphone
                        </p>
                        <p className="text-base font-medium">
                          +212 {barber.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Adresse
                        </p>
                        <p className="text-base font-medium">
                          {barber.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Âge</p>
                        <p className="text-base font-medium">
                          {age ? `${age} ans` : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CircleDot className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Sexe
                        </p>
                        <p className="text-base font-medium">
                          {barber.gender === "m" ? "Homme" : "Femme"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Localisation
                        </p>
                        <p className="text-base font-medium">
                          {barber.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infos professionnelles */}
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  Informations professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Expérience
                    </p>
                    <p className="text-base font-medium">{barber.experience}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <p className="text-sm font-medium text-gray-500">
                      Biographie
                    </p>
                  </div>
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 pl-8">
                    {barber.bio}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services proposés */}
            {barber.services && barber.services.length > 0 && (
              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-emerald-500" />
                    Services proposés
                  </CardTitle>
                  <CardDescription>
                    Prestations professionnelles disponibles ({barber.services.length}{" "}
                    services)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-4">
                      {barber.services.map((service) => (
                        <CarouselItem
                          key={service.id}
                          className="pl-4 md:basis-1/2 lg:basis-1/3"
                        >
                          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            {service.popular && (
                              <Badge className="absolute top-3 right-3 bg-orange-500 text-white z-10 shadow-lg">
                                Populaire
                              </Badge>
                            )}

                            {service.image && (
                              <div className="h-40 overflow-hidden">
                                <img
                                  src={`${import.meta.env.VITE_BACKEND_URL
                                    }/storage/${service.image}`}
                                  alt={service.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.png";
                                  }}
                                />
                              </div>
                            )}

                            <CardContent className="p-4 flex flex-col h-full">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                                  {service.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                  {service.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600 mt-auto">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4 text-emerald-500" />
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {service.price} MAD
                                  </span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {service.duration} min
                                  </span>
                                </div>
                              </div>

                              {service.category && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {service.category}
                                  </Badge>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" />
                    <CarouselNext className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" />
                  </Carousel>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne droite - Formulaire de réservation */}
          <div className="space-y-6">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-emerald-500" />
                  Prendre rendez-vous
                </CardTitle>
                <CardDescription>
                  Réservez votre visite avec {barber.firstname}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationForm barberId={barber.id} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-6">
          <BarberScheduleDisplay barberId={barber.id} />
        </div>
        {/* Section Avis */}
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"> 
          <CardContent>
            <BarberReviews barberId={barber.id} />
          </CardContent>
        </Card>

        {/* Informations complémentaires */}
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-emerald-500" />
              Informations complémentaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Dernière mise à jour
                  </p>
                  <p className="text-base font-medium">
                    {barber.formatted_updated_at ||
                      (barber.updated_at
                        ? format(new Date(barber.updated_at), "PPP")
                        : "N/A")}
                  </p>
                </div>
              </div>

              {barber.email_verified_at && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Statut de l'email
                    </p>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      Vérifié
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
