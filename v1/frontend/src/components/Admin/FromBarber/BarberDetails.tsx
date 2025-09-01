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
  DollarSign,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import BarberReviewsAdmin from "@/components/UIcomponents/BarberReviewsAdmin";

// Define the Barber type
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
};

interface BarberDetailsProps {
  barber: Barber;
}

export default function BarberDetails({ barber }: BarberDetailsProps) {
  if (!barber) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        No barber data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-4xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl mb-12">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            {barber.firstname} {barber.lastname}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
            Professional Barber Profile
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-4 sm:p-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" /> Personal Details
            </h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-base">{barber.email}</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-base">+212 {barber.phone}</p>
                </div>
              </div>
              {/* DOB */}
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-base">
                    {format(new Date(barber.date_of_birth), "PPP")}
                  </p>
                </div>
              </div>
              {/* Gender */}
              <div className="flex items-center gap-3">
                <CircleDot className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-base">
                    {barber.gender === "m" ? "Male" : "Female"}
                  </p>
                </div>
              </div>
              {/* Address */}
              <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-base">{barber.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" /> Professional
              Details
            </h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-base">{barber.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-base">{barber.location}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <p className="text-sm font-medium">Bio</p>
              </div>
              <p className="text-base leading-relaxed">{barber.bio}</p>
            </div>
          </div>

          {/* Other Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-emerald-500" /> Other
              Information
            </h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-base">
                    {barber.formatted_updated_at ||
                      (barber.updated_at
                        ? format(new Date(barber.updated_at), "PPP")
                        : "N/A")}
                  </p>
                </div>
              </div>
              {barber.email_verified_at && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Email Verified</p>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {barber.services && barber.services.length > 0 && (
        <Card className="w-full max-w-4xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              Services Offered
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
              Professional services available for booking
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {barber.services.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg border-0 px-3 py-1">
                        ⭐ Popular
                      </Badge>
                    </div>
                  )}

                  {/* Service Image */}
                  {service.image && (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <img
                        src={
                          service.image
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/${
                                service.image
                              }`
                            : "placeholder.png"
                        }
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Service Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Service Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Price
                          </p>
                          <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                            {service.price} MAD
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Duration
                          </p>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {service.duration}min
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button className="w-full bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 hover:from-purple-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0">
                        Book Service
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* ✅ Add Barber Reviews Component Here */}
      <div className="pt-5 w-full max-w-4xl">
        <BarberReviewsAdmin barberId={barber.id} />
      </div>
    </div>
  );
}
