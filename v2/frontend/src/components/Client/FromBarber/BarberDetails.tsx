"use client"

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
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import BarberReviews from "@/components/UIcomponents/BarberReviews"
import ReservationForm from "../ForReservationClient/ReservationForm"

// Define the Barber type
export type Barber = {
  id: number
  firstname: string
  lastname: string
  date_of_birth: string
  gender: "m" | "f"
  address: string
  phone: string
  email: string
  bio: string
  experience: string
  location: string
  email_verified_at: string | null
  formatted_updated_at?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

interface BarberDetailsProps {
  barber: Barber
}

export default function BarberDetails({ barber }: BarberDetailsProps) {
  if (!barber) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        No barber data available.
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
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
                  <p className="text-base">{format(new Date(barber.date_of_birth), "PPP")}</p>
                </div>
              </div>
              {/* Gender */}
              <div className="flex items-center gap-3">
                <CircleDot className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-base">{barber.gender === "m" ? "Male" : "Female"}</p>
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
              <Award className="w-5 h-5 text-emerald-500" /> Professional Details
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
              <CircleDot className="w-5 h-5 text-emerald-500" /> Other Information
            </h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-base">
                    {barber.formatted_updated_at ||
                      (barber.updated_at ? format(new Date(barber.updated_at), "PPP") : "N/A")}
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
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8">
        {/* Reservation Form */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
          <ReservationForm barberId={barber.id} />
        </div>

        {/* Barber Reviews */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md overflow-auto max-h-[700px]">
          <BarberReviews barberId={barber.id} />
        </div>
      </div>
    </div>
  )
}
