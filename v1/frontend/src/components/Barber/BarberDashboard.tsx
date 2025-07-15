"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  MapPin,
  Clock,
  Mail,
  Phone,
  Search,
} from "lucide-react"
import axiosClient from "@/api/axios"
import { useUsercontext } from "@/context/UserContext"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Status badge component using shadcn Badge
const StatusBadge = ({ status }) => {
  const config = {
    pending: { text: "En attente", variant: "warning" },
    confirmed: { text: "Confirmé", variant: "success" },
    cancelled: { text: "Annulé", variant: "destructive" },
    done: { text: "Terminé", variant: "default" },
  }[status] || { text: status, variant: "outline" }

  return <Badge variant={config.variant}>{config.text}</Badge>
}

// Stats card component using shadcn Card
const StatCard = ({ icon: Icon, label, value }) => (
  <Card>
    <CardContent className="flex items-center justify-between pt-6">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </CardContent>
  </Card>
)

// Helper: Average Rating
const averageRating = (reviews) => {
  if (reviews.length === 0) return "0.0"
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return (total / reviews.length).toFixed(1)
}

// Review card component
const ReviewCard = ({ review }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium">{review.user?.name ?? "Client inconnu"}</div>
        <div className="flex text-amber-500">
          {Array(review.rating)
            .fill()
            .map((_, i) => (
              <Star key={i} className="w-4 h-4" fill="currentColor" />
            ))}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </CardContent>
    <CardFooter className="pt-0">
      <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
    </CardFooter>
  </Card>
)

const BarberDashboard = () => {
  const { user } = useUsercontext()
  const [reservations, setReservations] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Load reservations & reviews
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setLoading(false)
        return // Exit if user or user.id is not available
      }

      try {
        setLoading(true)
        // Fetch reservations for the specific barber (backend should filter by authenticated user)
        const res1 = await axiosClient.get("/api/barber/reservations")
        // Fetch reviews for the specific barber (backend should filter by authenticated user)
        const res2 = await axiosClient.get("/api/barber/reviews")
        setReservations(res1.data.data)
        setReviews(res2.data.data)
      } catch (error) {
        console.error("Error loading dashboard:", error)
        // Optionally set an error state to display to the user
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user]) // Re-run effect when user context changes

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosClient.put(`/api/barber/reservations/${id}/status`, { status: newStatus })
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  // Filter reservations based on search term
  const filteredReservations = useMemo(() => {
    if (!searchTerm) {
      return reservations
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return reservations.filter(
      (reservation) =>
        reservation.user?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        reservation.user?.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        reservation.user?.phone?.includes(lowerCaseSearchTerm) ||
        reservation.service?.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [reservations, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Chargement...</p>
      </div>
    )
  }

  // If user is not logged in or user.id is missing
  if (!user || !user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">
          Veuillez vous connecter en tant que barbier pour voir le tableau de bord.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10">
            <AvatarImage src={user?.profile_photo || "/badgebarber.jpg"} alt={user?.firstname} />
            <AvatarFallback>
              {user?.firstname?.[0]}
              {user?.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {user?.firstname} {user?.lastname}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {user?.location || "Non défini"}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Paramètres</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Calendar} label="Rdv Total" value={reservations.length} />
        <StatCard icon={DollarSign} label="Revenus estimés" value={`${reservations.length * 100} MAD`} />
        <StatCard icon={Star} label="Note Moyenne" value={averageRating(reviews)} />
        <StatCard icon={Users} label="Avis" value={reviews.length} />
      </div>

      {/* Tabs for Reservations and Reviews */}
      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="reviews">Avis Clients</TabsTrigger>
        </TabsList>

        {/* Reservations Tab */}
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Mes Réservations</CardTitle>
              <CardDescription>Gérez vos rendez-vous et mettez à jour leur statut</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher par client, email, téléphone ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4"
                />
              </div>

              {filteredReservations.length === 0 && searchTerm !== "" ? (
                <p className="text-center py-8 text-muted-foreground">
                  Aucune réservation trouvée pour "{searchTerm}".
                </p>
              ) : filteredReservations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucune réservation.</p>
              ) : (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden">
                      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-semibold">{reservation.user?.name ?? "Client inconnu"}</div>
                          <div className="text-sm text-muted-foreground">{reservation.service}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(reservation.reservation_time).toLocaleDateString()}
                            <Clock className="ml-2 mr-1 h-3 w-3" />
                            {new Date(reservation.reservation_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {/* Display client email and phone */}
                          {reservation.user?.email && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {reservation.user.email}
                            </div>
                          )}
                          {reservation.user?.phone && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {reservation.user.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={reservation.status} />
                          {reservation.status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-transparent"
                                onClick={() => updateStatus(reservation.id, "confirmed")}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Confirmer
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 bg-transparent"
                                onClick={() => updateStatus(reservation.id, "done")}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Terminer
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-transparent"
                                onClick={() => updateStatus(reservation.id, "cancelled")}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Annuler
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Avis Clients</CardTitle>
              <CardDescription>Consultez les avis laissés par vos clients</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucun avis pour le moment.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BarberDashboard
