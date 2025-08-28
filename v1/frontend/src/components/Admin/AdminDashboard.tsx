"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { CalendarIcon, ClockIcon, SearchIcon } from "lucide-react"
import axiosClient from "@/api/axios"
import debounce from "lodash.debounce"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import AdminBarberList from "../data-table/bareber/AdminBarberList"
import AdminClientList from "../data-table/client/AdminClientList"

const StatusBadge = ({ status }) => {
  const config = {
    pending: { text: "En attente", variant: "warning" },
    confirmed: { text: "Confirmé", variant: "success" },
    cancelled: { text: "Annulé", variant: "destructive" },
    done: { text: "Terminé", variant: "default" },
  }[status] || { text: status, variant: "outline" }

  return <Badge variant={config.variant}>{config.text}</Badge>
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const [filterType, setFilterType] = useState("client")
  const [filterText, setFilterText] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  // Fetch all reservations
  const fetchReservations = useCallback((filterTypeParam, filterTextParam) => {
    setLoading(true)
    axiosClient
      .get("/api/admin/reservations", {
        params: filterTextParam ? { filterType: filterTypeParam, filterText: filterTextParam } : {},
      })
      .then((res) => {
        const formatted = res.data.data.map((r) => ({
          id: r.id,
          client: r.user?.name ?? "Client inconnu",
          barber: r.barber ? `${r.barber.firstname} ${r.barber.lastname}` : "Barbier inconnu",
          service: r.service,
          date: new Date(r.reservation_time).toLocaleDateString(),
          time: new Date(r.reservation_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: r.status,
        }))
        setAppointments(formatted)
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err)
        setAppointments([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Debounced fetch
  const debouncedFetch = useCallback(
    debounce((type, text) => {
      fetchReservations(type, text)
    }, 500),
    [fetchReservations],
  )

  useEffect(() => {
    if (filterText.trim() === "") {
      fetchReservations("", "")
    } else {
      debouncedFetch(filterType, filterText)
    }
    setCurrentPage(1) // reset page when filtering
  }, [filterText, filterType, debouncedFetch, fetchReservations])

  // Apply client-side pagination
  const filteredAppointments = useMemo(() => appointments, [appointments])
  const indexOfLast = currentPage * perPage
  const indexOfFirst = indexOfLast - perPage
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredAppointments.length / perPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto py-6 space-y-8 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Filter controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Reservations</CardTitle>
          <CardDescription>Search for reservations by client or barber name.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 max-w-md">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Filter by client</SelectItem>
                <SelectItem value="barber">Filter by barber</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search by ${filterType === "client" ? "client" : "barber"} name...`}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading appointments...</p>
          ) : currentAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No appointments found.</p>
          ) : (
            <>
              <div className="space-y-4">
                {currentAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">
                        {appt.client} with {appt.barber}
                      </p>
                      <p className="text-muted-foreground">{appt.service}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {appt.date} <ClockIcon className="h-3 w-3 ml-2" /> {appt.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <StatusBadge status={appt.status} />
                    </div>
                  </div>
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
                        <PaginationLink
                          href="#"
                          isActive={i + 1 === currentPage}
                          onClick={() => paginate(i + 1)}
                        >
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

      {/* Admin Barber List */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Barber List</CardTitle>
            <CardDescription>Manage registered barbers.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminBarberList />
          </CardContent>
        </Card>
      </section>

      {/* Admin Client List */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>Manage registered clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminClientList />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
