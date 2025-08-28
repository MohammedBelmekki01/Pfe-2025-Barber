"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "@/api/axios"
import { User, Search } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const AllClientDoReservation = () => {
  const [allClients, setAllClients] = useState([]) // Store all fetched clients
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const clientsPerPage = 9 // Number of clients to display per page

  useEffect(() => {
    const fetchClientsWithReservations = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get("/api/barber/reservations")
        const reservations = response.data.data

        const uniqueClients = new Map()
        reservations.forEach((reservation) => {
          if (reservation.user && reservation.user.id) {
            uniqueClients.set(reservation.user.id, reservation.user)
          }
        })
        setAllClients(Array.from(uniqueClients.values()))
      } catch (err) {
        console.error("Error fetching clients with reservations:", err)
        setError("Failed to load clients. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchClientsWithReservations()
  }, [])

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      return allClients
    }
    return allClients.filter(
      (client) =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [allClients, searchTerm])

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Chargement des clients...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Mes Clients</CardTitle>
          <CardDescription>Liste des clients qui ont effectué des réservations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un client par nom ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on new search
              }}
              className="pl-9 pr-4"
            />
          </div>

          {filteredClients.length === 0 && searchTerm !== "" ? (
            <p className="text-center py-8 text-muted-foreground">Aucun client trouvé pour "{searchTerm}".</p>
          ) : filteredClients.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Aucun client trouvé avec des réservations.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentClients.map((client) => (
                <Card key={client.id} className="overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.profile_photo || "/placeholder.svg"} alt={client.name} />
                      <AvatarFallback>
                        {client.name ? client.name.charAt(0) : <User className="h-6 w-6 text-muted-foreground" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-lg">{client.name || "Client inconnu"}</div>
                      {client.email && <div className="text-sm text-muted-foreground">{client.email}</div>}
                      {client.phone && <div className="text-sm text-muted-foreground">{client.phone}</div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
        </CardContent>
      </Card>
    </div>
  )
}

export default AllClientDoReservation
