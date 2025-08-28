"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileText,
  Camera,
  Edit3,
  CheckCircle2,
  Clock,
  XCircle,
  Trophy
} from "lucide-react"
import UpdateBarberProfile from "./UpdateBarberProfile"
import axiosClient from "@/api/axios"
import { format } from "date-fns"

function Profile() {
  const [barber, setBarber] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBarberProfile()
  }, [])

  const fetchBarberProfile = async () => {
    try {
      const response = await axiosClient.get('/api/me')
      setBarber(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        color: "bg-yellow-500", 
        text: "Pending Approval", 
        icon: Clock,
        variant: "secondary" as const 
      },
      confirmed: { 
        color: "bg-green-500", 
        text: "Active", 
        icon: CheckCircle2,
        variant: "default" as const 
      },
      cancelled: { 
        color: "bg-red-500", 
        text: "Inactive", 
        icon: XCircle,
        variant: "destructive" as const 
      },
      done: { 
        color: "bg-blue-500", 
        text: "Completed", 
        icon: Trophy,
        variant: "outline" as const 
      }
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!barber) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No profile found</h3>
              <p className="mt-1 text-sm text-gray-500">Unable to load profile information.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = getStatusConfig(barber.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Barber Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your professional profile and settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              View Profile
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header Card */}
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20 p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                      <AvatarImage 
                        src={barber.image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${barber.image}` : "/badgebarber.jpg"} 
                        alt={`${barber.firstname} ${barber.lastname}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                        {barber.firstname?.[0]}{barber.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <div className={`w-8 h-8 rounded-full ${statusConfig.color} flex items-center justify-center shadow-lg`}>
                        <StatusIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {barber.firstname} {barber.lastname}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                        Professional Barber
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Badge variant={statusConfig.variant} className="px-3 py-1">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.text}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {barber.experience} years experience
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {barber.location}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="w-5 h-5 text-emerald-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{barber.email}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{barber.phone}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {format(new Date(barber.date_of_birth), "MMMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{barber.gender === 'm' ? 'Male' : 'Female'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Home Address</p>
                        <p className="font-medium">{barber.addrees}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Work Location</p>
                        <p className="font-medium">{barber.location}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium">{barber.experience} years</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="font-medium leading-relaxed">{barber.bio}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Information */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-purple-500" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl">
                    <Calendar className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-bold text-emerald-600">
                      {format(new Date(barber.created_at), "MMM yyyy")}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                    <User className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-bold text-blue-600 capitalize">{barber.role}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                    <Trophy className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-bold text-purple-600">{statusConfig.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20 p-8">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Edit3 className="w-6 h-6 text-emerald-500" />
                  Edit Profile
                </CardTitle>
                <CardDescription className="text-lg">
                  Update your professional information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <UpdateBarberProfile barber={barber} onUpdate={fetchBarberProfile} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile