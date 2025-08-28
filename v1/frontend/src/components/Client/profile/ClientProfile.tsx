"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import axiosClient from "@/api/axios"
import { toast } from "sonner"
import { format } from "date-fns"

function ClientProfile() {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchClientData = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/api/me')
      setClient(response.data)
    } catch (error) {
      console.error('Error fetching client data:', error)
      toast.error("Error loading profile data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientData()
  }, [])

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl">
        <CardContent className="p-12">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!client) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl">
        <CardContent className="p-12 text-center">
          <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile not found</h3>
          <p className="text-gray-600 dark:text-gray-400">Unable to load your profile information.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 p-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src="" alt={client.name} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
              {client.name?.charAt(0)?.toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {client.name}
            </h2>
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              <Shield className="w-3 h-3 mr-1" />
              {client.role?.charAt(0)?.toUpperCase() + client.role?.slice(1) || 'Client'}
            </Badge>
            {client.email_verified_at && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Email Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 text-blue-500" />
              Email Address
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {client.email}
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 text-green-500" />
              Phone Number
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {client.phone || 'Not provided'}
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-red-500" />
              Address
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {client.addrees || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member since: {format(new Date(client.created_at), 'MMMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last updated: {format(new Date(client.updated_at), 'MMMM dd, yyyy')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClientProfile