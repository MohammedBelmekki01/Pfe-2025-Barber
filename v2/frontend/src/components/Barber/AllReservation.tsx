"use client"

import { useEffect, useState, useMemo } from "react" // Added useMemo
import axiosClient from "@/api/axios"
import { Clock, Calendar, Mail, Phone, Search } from "lucide-react" // Added Search icon

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input" // Added Input component

// Status badge component (re-using the one from the barber dashboard)
const StatusBadge = ({ status }) => {
  const config = {
    pending: { text: "En attente", variant: "warning" },
    confirmed: { text: "Confirmé", variant: "success" },
    cancelled: { text: "Annulé", variant: "destructive" },
    done: { text: "Terminé", variant: "default" },
  }[status] || { text: status, variant: "outline" }

  return <Badge variant={config.variant}>{config.text}</Badge>
}

const AllReservationClient = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // New state for search term

  useEffect(() => {
    const fetchClientReservations = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get("/api/barber/reservations")
        setReservations(response.data.data)
      } catch (err) {
        console.error("Error fetching client reservations:", err)
        setError("Failed to load reservations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchClientReservations()
  }, [])

  // Filter reservations based on search term
  const filteredReservations = useMemo(() => {
    if (!searchTerm) {
      return reservations
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return reservations.filter(
      (reservation) =>
        reservation.barber?.firstname?.toLowerCase().includes(lowerCaseSearchTerm) ||
        reservation.barber?.lastname?.toLowerCase().includes(lowerCaseSearchTerm) ||
        reservation.barber?.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        reservation.barber?.phone?.includes(lowerCaseSearchTerm) ||
        reservation.service?.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [reservations, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg text-muted-foreground">Chargement de vos réservations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8 bg-background text-foreground min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Mes Réservations</CardTitle>
          <CardDescription>Consultez l'historique et le statut de vos rendez-vous.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par barbier, email, téléphone ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>

          {filteredReservations.length === 0 && searchTerm !== "" ? (
            <p className="text-center py-8 text-muted-foreground">Aucune réservation trouvée pour "{searchTerm}".</p>
          ) : filteredReservations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Vous n'avez aucune réservation pour le moment.</p>
          ) : (
            <div className="grid gap-4">
              {filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="overflow-hidden border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                    <div className="space-y-1">
                      <div className="font-semibold text-lg">{reservation.service || "Service inconnu"}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(reservation.reservation_time).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(reservation.reservation_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {reservation.barber && (
                        <>
                          <div className="text-sm text-muted-foreground mt-1">
                            Avec:{" "}
                            <span className="font-medium">
                              {reservation.barber.firstname} {reservation.barber.lastname || "Barbier inconnu"}
                            </span>
                          </div>
                          {/* Display barber's email and phone */}
                          {reservation.barber.email && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {reservation.barber.email}
                            </div>
                          )}
                          {reservation.barber.phone && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {reservation.barber.phone}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={reservation.status} />
                      {/* You can add client-specific actions here if needed, e.g., cancel button for pending */}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AllReservationClient
