"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Users,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Settings,
  MapPin,
  Clock,
  Mail,
  Phone,
  Search,
  Filter,
  X,
  AtSign,
  CalendarIcon,
  ClockIcon,
  Scissors,
} from "lucide-react";
import axiosClient from "@/api/axios";
import { useUsercontext } from "@/context/UserContext";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "../ui/mode-toggle";

// Types
interface BarberUser {
  id?: number;
  name: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  location?: string;
  profile_photo?: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
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
  user?: Client;
  service?: Service;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user?: Client;
  service?: Service;
}

// Status steps for the stepper
const STATUS_STEPS = [
  {
    key: "pending",
    label: "En attente",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "from-gray-900 to-yellow-400",
  },
  {
    key: "confirmed",
    label: "Confirmé",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "from-gray-900 to-green-400",
  },
  {
    key: "done",
    label: "Terminé",
    icon: <Calendar className="w-5 h-5" />,
    color: "from-gray-900 to-blue-400",
  },
  {
    key: "cancelled",
    label: "Annulé",
    icon: <XCircle className="w-5 h-5" />,
    color: "from-gray-900 to-red-400",
  },
];

// Stepper component
const StatusStepper = ({
  status,
  onStepClick,
  disabled,
}: {
  status: "pending" | "confirmed" | "cancelled" | "done";
  onStepClick?: (newStatus: "pending" | "confirmed" | "cancelled" | "done") => void;
  disabled?: boolean;
}) => {
  const activeIdx = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-2 w-full justify-center py-2">
      {STATUS_STEPS.filter(
        (step) =>
          step.key !== "cancelled" || status === "cancelled"
      ).map((step, idx, arr) => {
        const isActive = status === step.key;
        const isCompleted = activeIdx > idx;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <button
              disabled={
                disabled ||
                isActive ||
                (step.key === "cancelled" && status !== "pending")
              }
              onClick={() => onStepClick && onStepClick(step.key as any)}
              className={`
                rounded-full p-2 shadow-lg
                bg-gradient-to-br ${step.color}
                ${isActive ? "ring-4 ring-yellow-300 scale-110" : ""}
                ${isCompleted ? "opacity-70" : ""}
                text-white transition-all
                focus:outline-none
                ${
                  disabled ||
                  isActive ||
                  (step.key === "cancelled" && status !== "pending")
                    ? "cursor-not-allowed opacity-60"
                    : "hover:scale-105"
                }
              `}
              title={step.label}
              type="button"
            >
              {step.icon}
            </button>
            <span
              className={`ml-2 text-xs font-semibold ${
                isActive
                  ? "text-yellow-400"
                  : isCompleted
                  ? "text-gray-400"
                  : "text-gray-300"
              }`}
            >
              {step.label}
            </span>
            {idx < arr.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gradient-to-r from-gray-700 to-gray-300 rounded" />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper: Average Rating
const averageRating = (reviews: Review[]) => {
  if (reviews.length === 0) return "0.0";
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews.length).toFixed(1);
};

const BarberDashboard = () => {
  const { user } = useUsercontext() as { user: BarberUser | null };
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Advanced filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReservations = reservations.length;
    const averageNote = averageRating(reviews);
    const totalReviews = reviews.length;
    const totalClients = new Set(reservations.map((r) => r.user_id)).size;

    return {
      reservations: totalReservations,
      averageNote,
      reviews: totalReviews,
      clients: totalClients,
    };
  }, [reservations, reviews]);

  // Load reservations & reviews
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        setStatsLoading(false);
        return;
      }

      try {
        setLoading(true);
        setStatsLoading(true);
        // Fetch reservations for the specific barber
        const res1 = await axiosClient.get("/api/barber/reservations");
        // Fetch reviews for the specific barber
        const res2 = await axiosClient.get("/api/barber/reviews");
        setReservations(res1.data.data || []);
        setReviews(res2.data.data || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setReservations([]);
        setReviews([]);
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Advanced filtering logic
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameFilterLower = nameFilter.toLowerCase();
      const emailFilterLower = emailFilter.toLowerCase();

      // General search
      const matchesSearchTerm =
        !searchTerm ||
        reservation.user?.name?.toLowerCase().includes(searchTermLower) ||
        reservation.user?.email?.toLowerCase().includes(searchTermLower) ||
        reservation.user?.phone?.includes(searchTerm) ||
        reservation.service?.name?.toLowerCase().includes(searchTermLower);

      // Specific filters
      const matchesNameFilter =
        !nameFilter ||
        reservation.user?.name?.toLowerCase().includes(nameFilterLower);

      const matchesEmailFilter =
        !emailFilter ||
        reservation.user?.email?.toLowerCase().includes(emailFilterLower);

      const matchesStatusFilter =
        statusFilter === "all" || reservation.status === statusFilter;

      return (
        matchesSearchTerm &&
        matchesNameFilter &&
        matchesEmailFilter &&
        matchesStatusFilter
      );
    });
  }, [reservations, searchTerm, nameFilter, emailFilter, statusFilter]);

  const updateStatus = async (
    id: number,
    newStatus: "pending" | "confirmed" | "cancelled" | "done"
  ) => {
    try {
      await axiosClient.put(`/api/barber/reservations/${id}/status`, {
        status: newStatus,
      });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Review card component
  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            {review.user?.name ?? "Client inconnu"}
          </div>
          <div className="flex text-amber-500">
            {Array(review.rating)
              .fill(0)
              .map((_, i) => (
                <Star key={i} className="w-4 h-4" fill="currentColor" />
              ))}
          </div>
        </div>
        {review.service?.name && (
          <div className="text-sm text-muted-foreground mt-1">
            Service : {review.service.name}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      </CardContent>
      <div className="px-6 pb-4">
        <p className="text-xs text-muted-foreground">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg text-destructive">
          Veuillez vous connecter en tant que barbier pour voir le tableau de
          bord.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-xl">
              <AvatarImage
                src={user?.profile_photo || "/badgebarber.jpg"}
                alt={user?.firstname}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl">
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user?.firstname} {user?.lastname}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                {user?.location || "Non défini"}
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="icon" className="shadow-lg">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="outline" size="icon" className="shadow-lg">
                <ModeToggle />
              </Button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos rendez-vous et consultez vos statistiques
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Réservations
                  </p>
                  <p className="text-3xl font-bold">
                    {statsLoading ? "..." : stats.reservations}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Note Moyenne
                  </p>
                  <p className="text-3xl font-bold">
                    {statsLoading ? "..." : stats.averageNote}
                  </p>
                </div>
                <Star className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Avis
                  </p>
                  <p className="text-3xl font-bold">
                    {statsLoading ? "..." : stats.reviews}
                  </p>
                </div>
                <MessageSquare className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Total Clients
                  </p>
                  <p className="text-3xl font-bold">
                    {statsLoading ? "..." : stats.clients}
                  </p>
                </div>
                <Users className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Reservations and Reviews */}
        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto shadow-lg">
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="reviews">Avis Clients</TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mes Réservations ({filteredReservations.length})
                </CardTitle>
                <CardDescription>
                  Gérez vos rendez-vous avec un système de filtrage avancé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Advanced Filtering System */}
                <div className="space-y-4">
                  {/* General Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher dans toutes les réservations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Advanced Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Name Filter */}
                    <div className="flex-1">
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Filtrer par nom client..."
                          value={nameFilter}
                          onChange={(e) => setNameFilter(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Email Filter */}
                    <div className="flex-1">
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Filtrer par email..."
                          value={emailFilter}
                          onChange={(e) => setEmailFilter(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex-1 sm:max-w-[200px]">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Statut" />
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

                    {/* Reset Filters Button */}
                    {(nameFilter || emailFilter || statusFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setNameFilter("");
                          setEmailFilter("");
                          setStatusFilter("all");
                        }}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Results Indicator */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {filteredReservations.length} réservation(s) trouvée(s)
                      {(searchTerm ||
                        nameFilter ||
                        emailFilter ||
                        statusFilter !== "all") &&
                        ` sur ${reservations.length} au total`}
                    </span>
                    {(searchTerm ||
                      nameFilter ||
                      emailFilter ||
                      statusFilter !== "all") && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtres actifs
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80">
                          <div className="space-y-3">
                            <h4 className="font-medium">Filtres appliqués :</h4>
                            {searchTerm && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Recherche générale
                                </span>
                                <Badge variant="secondary">{searchTerm}</Badge>
                              </div>
                            )}
                            {nameFilter && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Nom</span>
                                <Badge variant="secondary">{nameFilter}</Badge>
                              </div>
                            )}
                            {emailFilter && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Email</span>
                                <Badge variant="secondary">{emailFilter}</Badge>
                              </div>
                            )}
                            {statusFilter !== "all" && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Statut</span>
                                <Badge variant="secondary">{statusFilter}</Badge>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>

                {/* Reservations Display */}
                {filteredReservations.length === 0 && searchTerm !== "" ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Aucune réservation trouvée pour "{searchTerm}"
                    </p>
                    <p className="text-gray-500 dark:text-gray-500">
                      Essayez d'ajuster vos filtres
                    </p>
                  </div>
                ) : filteredReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Aucune réservation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                      <Card
                        key={reservation.id}
                        className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Client Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="w-12 h-12 border-2 border-blue-200">
                                <AvatarImage
                                  src=""
                                  alt={reservation.user?.name}
                                />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                                  {reservation.user?.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {reservation.user?.name ?? "Client inconnu"}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Client
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  {reservation.user?.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      <span>{reservation.user.email}</span>
                                    </div>
                                  )}
                                  {reservation.user?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      <span>{reservation.user.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="flex flex-col items-end gap-3 min-w-[220px]">
                              {/* Stepper */}
                              <StatusStepper
                                status={reservation.status}
                                onStepClick={async (newStatus) => {
                                  if (newStatus !== reservation.status) {
                                    await updateStatus(reservation.id, newStatus);
                                  }
                                }}
                                disabled={reservation.status === "done" || reservation.status === "cancelled"}
                              />

                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>
                                    {format(
                                      new Date(reservation.reservation_time),
                                      "MMM dd, yyyy"
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>
                                    {format(
                                      new Date(reservation.reservation_time),
                                      "HH:mm"
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Modern Confirm/Cancel Buttons */}
                              {reservation.status !== "done" &&
                                reservation.status !== "cancelled" && (
                                  <div className="flex gap-2 mt-2">
                                    {reservation.status === "pending" && (
                                      <Button
                                        className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-md hover:scale-105 hover:brightness-110 transition"
                                        onClick={() =>
                                          updateStatus(reservation.id, "confirmed")
                                        }
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Confirmer
                                      </Button>
                                    )}
                                    {reservation.status === "confirmed" && (
                                      <Button
                                        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-full shadow-md hover:scale-105 hover:brightness-110 transition"
                                        onClick={() =>
                                          updateStatus(reservation.id, "done")
                                        }
                                      >
                                        <Calendar className="mr-1 h-4 w-4" />
                                        Terminer
                                      </Button>
                                    )}
                                    {reservation.status === "pending" && (
                                      <Button
                                        className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-full shadow-md hover:scale-105 hover:brightness-110 transition"
                                        onClick={() =>
                                          updateStatus(reservation.id, "cancelled")
                                        }
                                      >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Annuler
                                      </Button>
                                    )}
                                  </div>
                                )}
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
                                <span className="text-sm text-gray-600 dark:text-gray-400">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avis Clients ({reviews.length})
                </CardTitle>
                <CardDescription>
                  Consultez les avis laissés par vos clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Aucun avis pour le moment
                    </p>
                    <p className="text-gray-500 dark:text-gray-500">
                      Les avis de vos clients apparaîtront ici
                    </p>
                  </div>
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
    </div>
  );
};

export default BarberDashboard;
