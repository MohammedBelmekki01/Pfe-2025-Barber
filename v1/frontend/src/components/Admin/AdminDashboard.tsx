"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CalendarIcon,
  ClockIcon,
  SearchIcon,
  Users,
  Scissors,
  Calendar,
  BookOpen,
  Filter,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";
import axiosClient from "@/api/axios";
import debounce from "lodash.debounce";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import AdminBarberList from "../data-table/bareber/AdminBarberList";
import AdminClientList from "../data-table/client/AdminClientList";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  addrees: string;
  role: string;
}

interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  bio: string;
  status: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
}

interface Reservation {
  id: number;
  user_id: number;
  barber_id: number;
  service_id: number;
  reservation_time: string;
  status: "pending" | "confirmed" | "cancelled" | "done";
  created_at: string;
  updated_at: string;
  user: User;
  barber: Barber;
  service?: Service;
}

interface Stats {
  clients: number;
  barbers: number;
  services: number;
  reservations: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "done":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <Badge
      className={`${getStatusColor(status)} border-0 flex items-center gap-1`}
    >
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    barbers: 0,
    services: 0,
    reservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Advanced filtering state
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    dateFrom: "",
    dateTo: "",
    filterType: "client", // client, barber, service
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [clientsRes, barbersRes, servicesRes, reservationsRes] =
        await Promise.all([
          axiosClient.get("/api/admin/clients"),
          axiosClient.get("/api/admin/barbers"),
          axiosClient.get("/api/admin/services"),
          axiosClient.get("/api/admin/reservations"),
        ]);

      setStats({
        clients: clientsRes.data.data?.length || 0,
        barbers: barbersRes.data.data?.length || 0,
        services: servicesRes.data.data?.length || 0,
        reservations: reservationsRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch reservations with advanced filtering
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};

      if (filters.status) params.status = filters.status;
      if (filters.search) {
        params.filterType = filters.filterType;
        params.filterText = filters.search;
      }
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await axiosClient.get("/api/admin/reservations", {
        params,
      });
      setReservations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced search
  const debouncedFetch = useMemo(
    () => debounce(fetchReservations, 500),
    [fetchReservations]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (filters.search.trim() === "") {
      fetchReservations();
    } else {
      debouncedFetch();
    }
    setCurrentPage(1);
  }, [filters, fetchReservations, debouncedFetch]);

  // Responsive advanced filter logic
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      // Status filter
      if (filters.status && reservation.status !== filters.status) return false;

      // Date filters
      if (filters.dateFrom && reservation.reservation_time < filters.dateFrom)
        return false;
      if (filters.dateTo && reservation.reservation_time > filters.dateTo)
        return false;

      // Search filter by type
      if (filters.search.trim()) {
        const search = filters.search.toLowerCase();
        if (filters.filterType === "client") {
          if (!reservation.user?.name?.toLowerCase().includes(search)) return false;
        } else if (filters.filterType === "barber") {
          const barberName = `${reservation.barber?.firstname ?? ""} ${reservation.barber?.lastname ?? ""}`.toLowerCase();
          if (!barberName.includes(search)) return false;
        } else if (filters.filterType === "service") {
          if (!reservation.service?.name?.toLowerCase().includes(search)) return false;
        }
      }

      return true;
    });
  }, [reservations, filters]);

  // Pagination logic
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentReservations = filteredReservations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / perPage));

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez votre salon avec des statistiques et des outils puissants
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">
                    Nombre de clients
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {statsLoading ? "..." : stats.clients}
                  </p>
                </div>
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium">
                    Nombre de barbiers
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {statsLoading ? "..." : stats.barbers}
                  </p>
                </div>
                <Scissors className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs sm:text-sm font-medium">
                    Nombre de services
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {statsLoading ? "..." : stats.services}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs sm:text-sm font-medium">
                    Nombre de réservations
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {statsLoading ? "..." : stats.reservations}
                  </p>
                </div>
                <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres avancés
            </CardTitle>
            <CardDescription>
              Filtrez les réservations selon plusieurs critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    updateFilter("status", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="done">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Type de recherche
                </label>
                <Select
                  value={filters.filterType}
                  onValueChange={(value) => updateFilter("filterType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Par client</SelectItem>
                    <SelectItem value="barber">Par barbier</SelectItem>
                    <SelectItem value="service">Par service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Recherche</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Recherche par ${filters.filterType === "client"
                      ? "client"
                      : filters.filterType === "barber"
                        ? "barbier"
                        : "service"
                    }...`}
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date de début
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date de fin
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    status: "",
                    search: "",
                    dateFrom: "",
                    dateTo: "",
                    filterType: "client",
                  })
                }
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modern Reservations Display */}
        <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Réservations récentes ({filteredReservations.length})
            </CardTitle>
            <CardDescription>
              Gérez et surveillez tous les rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Chargement des réservations...
                  </p>
                </div>
              </div>
            ) : currentReservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Aucune réservation trouvée
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  Essayez d&apos;ajuster vos filtres
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentReservations.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left Section - Client & Barber Info */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Client Avatar */}
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-blue-200">
                            <AvatarImage src="" alt={reservation.user.name} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                              {reservation.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link to={`/admin/client-details?id=${reservation.user.id}`} className="text-emerald-600 hover:underline ">
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white hover:text-emerald-600">
                                  {reservation.user.name}
                                </h3>
                              </Link>
                              <Badge variant="secondary" className="text-xs">
                                Client
                              </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span>{reservation.user.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span>+212 {reservation.user.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Center Section - Barber Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-green-200">
                            <AvatarImage
                              src=""
                              alt={`${reservation.barber.firstname} ${reservation.barber.lastname}`}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold">
                              {getInitials(
                                reservation.barber.firstname,
                                reservation.barber.lastname
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                to={`/admin/barber-details?id=${reservation.barber.id}`}
                                className="text-emerald-600 hover:underline "
                              >
                                <h4 className="font-bold text-base sm:text-lg text-gray-900 hover:text-emerald-600 dark:text-white">
                                  {reservation.barber.firstname}{" "}
                                  {reservation.barber.lastname}
                                </h4>
                              </Link>

                              <Badge variant="secondary" className="text-xs">
                                Barbier
                              </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{reservation.barber.experience}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{reservation.barber.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Appointment Details */}
                        <div className="flex flex-col items-end gap-3 min-w-[160px]">
                          <StatusBadge status={reservation.status} />

                          <div className="text-right">
                            <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              <CalendarIcon className="w-4 h-4" />
                              <span>
                                {format(
                                  new Date(reservation.reservation_time),
                                  "dd MMM yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <ClockIcon className="w-4 h-4" />
                              <span>
                                {format(
                                  new Date(reservation.reservation_time),
                                  "HH:mm"
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Réservation #{reservation.id}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Créée le :{" "}
                              {format(
                                new Date(reservation.created_at),
                                "dd MMM"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      {reservation.service && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-purple-500" />
                            <span className="font-medium text-purple-700 dark:text-purple-300">
                              {reservation.service.name}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              - {reservation.service.duration}min
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {reservation.service.price} MAD
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        isActive={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>

        {/* Admin Management Sections */}
        <div className="pb-5">
          {/* Barber Management */}
          <Card className="mb-5 shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Gestion des barbiers
              </CardTitle>
              <CardDescription>
                Gérez les barbiers inscrits et leurs profils
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminBarberList />
            </CardContent>
          </Card>

          {/* Client Management */}
          <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestion des clients
              </CardTitle>
              <CardDescription>
                Gérez les clients inscrits et leurs comptes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminClientList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
