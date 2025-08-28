"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "@/api/axios"
import { Clock, Calendar, Mail, Phone, User, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const StatusBadge = ({ status }) => {
  const config = {
    pending: { text: "En attente", variant: "warning" },
    confirmed: { text: "Confirmé", variant: "success" },
    cancelled: { text: "Annulé", variant: "destructive" },
    done: { text: "Terminé", variant: "default" },
  }[status] || { text: status, variant: "outline" }

  return <Badge variant={config.variant}>{config.text}</Badge>
}

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// ...existing code...

const AllReservationClient = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const reservationsPerPage = 6

  useEffect(() => {
    const fetchClientReservations = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get("/api/barber/reservations")
        setReservations(response.data.data)
      } catch (err) {
        setError("Erreur lors du chargement des réservations.")
      } finally {
        setLoading(false)
      }
    }
    fetchClientReservations()
  }, [])

  // Filter by user data only
  const filteredReservations = useMemo(() => {
    if (!searchTerm) return reservations
    const term = searchTerm.toLowerCase()
    return reservations.filter((reservation) =>
      reservation.user?.name?.toLowerCase().includes(term) ||
      reservation.user?.email?.toLowerCase().includes(term) ||
      reservation.user?.phone?.toLowerCase().includes(term) ||
      reservation.user?.addrees?.toLowerCase().includes(term)
    )
  }, [reservations, searchTerm])

  // Pagination logic
  const indexOfLastReservation = currentPage * reservationsPerPage
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation)
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Rechercher par nom, email, téléphone, adresse client..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 pr-4"
            />
          </div>
          {filteredReservations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? `Aucune réservation trouvée pour "${searchTerm}".`
                : "Vous n'avez aucune réservation pour le moment."}
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentReservations.map((reservation) => (
                  <Card key={reservation.id} className="overflow-hidden border hover:shadow-lg transition-shadow">
                    {/* ...existing card content... */}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={reservation.service?.image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${reservation.service.image}` : "/placeholder.svg"} alt={reservation.service?.name} />
                          <AvatarFallback>
                            {reservation.service?.name?.charAt(0) || <User className="h-6 w-6 text-muted-foreground" />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-lg">{reservation.service?.name || "Service inconnu"}</div>
                          <div className="text-xs text-muted-foreground">{reservation.service?.description}</div>
                          <div className="text-xs text-muted-foreground">Prix: {reservation.service?.price} MAD</div>
                          <div className="text-xs text-muted-foreground">Durée: {reservation.service?.duration} min</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(reservation.reservation_time).toLocaleDateString()}
                          <Clock className="ml-2 mr-1 h-4 w-4" />
                          {new Date(reservation.reservation_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <StatusBadge status={reservation.status} />
                          <span className="ml-2 text-xs">Réservé le {new Date(reservation.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <div className="font-semibold text-sm">Barbier</div>
                          <div className="text-xs text-muted-foreground">
                            {reservation.barber?.firstname} {reservation.barber?.lastname}
                          </div>
                          {reservation.barber?.email && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {reservation.barber.email}
                            </div>
                          )}
                          {reservation.barber?.phone && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {reservation.barber.phone}
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="font-semibold text-sm">Client</div>
                          <div className="text-xs text-muted-foreground">
                            {reservation.user?.name}
                          </div>
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
                          {reservation.user?.addrees && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {reservation.user.addrees}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() => paginate(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink href="#" isActive={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() => paginate(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AllReservationClient