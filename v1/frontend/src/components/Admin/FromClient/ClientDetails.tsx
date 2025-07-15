"use client"

import {
  Mail,
  Phone,
  MapPin,
  User,
  CalendarDays,
  CircleDot,
} from "lucide-react"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export type Client = {
  id: number
  name: string
  email: string
  addrees: string
  phone: string
  password?: string
  created_at?: string
  updated_at?: string
  email_verified_at?: string | null
}

interface ClientDetailsProps {
  client: Client
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  if (!client) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        No client data available.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl mb-12">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            {client.name}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
            Client Information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-4 sm:p-6">
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="w-5 h-5 text-emerald-500" /> Personal Information
            </h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-base">{client.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-base">+212 {client.phone}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-base">{client.addrees}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <CircleDot className="w-5 h-5 text-emerald-500" /> Account Info
            </h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Created At */}
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Registered On</p>
                  <p className="text-base">
                    {client.created_at ? format(new Date(client.created_at), "PPP") : "N/A"}
                  </p>
                </div>
              </div>

              {/* Email Verified */}
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium">Email Status</p>
                  {client.email_verified_at ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
