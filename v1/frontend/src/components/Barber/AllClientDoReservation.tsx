"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "@/api/axios"
import { 
  User, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  X, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Users,
  TrendingUp
} from "lucide-react"
import { format } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "dd/MM/yyyy 'à' HH:mm");
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { text: "En attente", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
    confirmed: { text: "Confirmé", variant: "default" as const, color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
    cancelled: { text: "Annulé", variant: "destructive" as const, color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
    done: { text: "Terminé", variant: "outline" as const, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  }[status] || { text: status, variant: "outline" as const, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" }
  
  return (
    <Badge variant={config.variant} className={`${config.color} font-medium`}>
      {config.text}
    </Badge>
  )
}

const AllClientDoReservation = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // États de filtrage
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  
  const [currentPage, setCurrentPage] = useState(1)
  const clientsPerPage = 12

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get("/api/barber/reservations")
        setReservations(response.data.data || [])
      } catch (err) {
        setError("Failed to load clients. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchReservations()
  }, [])

  // Build unique clients with their latest reservation and stats
  const allClients = useMemo(() => {
    const clientMap = new Map()
    reservations.forEach((reservation) => {
      const user = reservation.user
      if (user && user.id) {
        if (!clientMap.has(user.id)) {
          clientMap.set(user.id, {
            ...user,
            reservations: [],
            totalReservations: 0,
            latestReservation: null,
          })
        }
        
        const clientData = clientMap.get(user.id)
        clientData.reservations.push(reservation)
        clientData.totalReservations = clientData.reservations.length
        
        if (
          !clientData.latestReservation ||
          new Date(reservation.reservation_time) > new Date(clientData.latestReservation.reservation_time)
        ) {
          clientData.latestReservation = reservation
        }
      }
    })
    return Array.from(clientMap.values())
  }, [reservations])

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = allClients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone?.includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (client) => client.latestReservation?.status === statusFilter
      )
    }

    // Email verified filter
    if (emailVerifiedFilter !== "all") {
      const isVerified = emailVerifiedFilter === "verified"
      filtered = filtered.filter(
        (client) => !!client.email_verified_at === isVerified
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "email":
          return (a.email || "").localeCompare(b.email || "")
        case "reservations":
          return b.totalReservations - a.totalReservations
        case "recent":
          return new Date(b.latestReservation?.reservation_time || 0).getTime() - 
                 new Date(a.latestReservation?.reservation_time || 0).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [allClients, searchTerm, statusFilter, emailVerifiedFilter, sortBy])

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredAndSortedClients.slice(indexOfFirstClient, indexOfLastClient)
  const totalPages = Math.ceil(filteredAndSortedClients.length / clientsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setEmailVerifiedFilter("all")
    setSortBy("name")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || emailVerifiedFilter !== "all" || sortBy !== "name"

  // Stats
  const stats = useMemo(() => {
    const totalClients = allClients.length
    const verifiedClients = allClients.filter(c => c.email_verified_at).length
    const totalReservations = reservations.length
    const activeClients = allClients.filter(c => 
      c.latestReservation && 
      (c.latestReservation.status === "confirmed" || c.latestReservation.status === "pending")
    ).length

    return { totalClients, verifiedClients, totalReservations, activeClients }
  }, [allClients, reservations])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Chargement des clients...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg text-red-500">{error}</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Mes Clients
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez et suivez vos clients et leurs réservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clients Vérifiés</p>
                  <p className="text-3xl font-bold text-green-600">{stats.verifiedClients}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Réservations</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalReservations}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clients Actifs</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.activeClients}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-amber-600" />
                <CardTitle>Filtres et Recherche</CardTitle>
              </div>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={resetFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut de la dernière réservation</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="done">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email vérifié</label>
                <Select value={emailVerifiedFilter} onValueChange={setEmailVerifiedFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="verified">Vérifiés</SelectItem>
                    <SelectItem value="unverified">Non vérifiés</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trier par</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="reservations">Nombre de réservations</SelectItem>
                    <SelectItem value="recent">Plus récent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Recherche: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Statut: {statusFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                  </Badge>
                )}
                {emailVerifiedFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Email: {emailVerifiedFilter === "verified" ? "Vérifié" : "Non vérifié"}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setEmailVerifiedFilter("all")} />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedClients.length} client{filteredAndSortedClients.length > 1 ? 's' : ''} trouvé{filteredAndSortedClients.length > 1 ? 's' : ''}
            {hasActiveFilters && ` sur ${allClients.length} au total`}
          </p>
        </div>

        {/* Clients Grid */}
        {filteredAndSortedClients.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {hasActiveFilters ? "Aucun client trouvé" : "Aucun client"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {hasActiveFilters 
                  ? "Aucun client ne correspond aux critères de recherche."
                  : "Aucun client n'a encore effectué de réservation."
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentClients.map((client) => {
              const r = client.latestReservation
              return (
                <Card
                  key={client.id}
                  className="group border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Client Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                          <AvatarImage src={client.profile_photo} alt={client.name} />
                          <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold">
                            {client.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {client.email_verified_at && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                          {client.name || "Client inconnu"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={client.totalReservations > 5 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {client.totalReservations} réservation{client.totalReservations > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 text-amber-600" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      
                      {client.addrees && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="truncate">{client.addrees}</span>
                        </div>
                      )}
                    </div>

                    {/* Latest Reservation */}
                    {r && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Dernière réservation
                          </span>
                          <StatusBadge status={r.status} />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {formatDate(r.reservation_time)}
                            </span>
                          </div>
                          
                          {r.service && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Service:</strong> {r.service.name}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Member Since */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                        Client depuis le {formatDate(client.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) paginate(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNumber
                  if (totalPages <= 7) {
                    pageNumber = i + 1
                  } else if (currentPage <= 4) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 3) {
                    pageNumber = totalPages - 6 + i
                  } else {
                    pageNumber = currentPage - 3 + i
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        href="#" 
                        isActive={pageNumber === currentPage} 
                        onClick={(e) => {
                          e.preventDefault()
                          paginate(pageNumber)
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) paginate(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllClientDoReservation