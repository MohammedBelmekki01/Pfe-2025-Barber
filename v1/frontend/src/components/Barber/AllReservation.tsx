"use client";

import { useEffect, useState, useMemo } from "react";
import axiosClient from "@/api/axios";
import {
  Clock,
  Calendar,
  Mail,
  Phone,
  Search,
  Filter,
  X,
  Users,
  AtSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Types
interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Reservation {
  id: number;
  barber_id: number;
  user_id: number;
  service_id: number;
  reservation_time: string;
  status: "pending" | "confirmed" | "cancelled" | "done";
  barber?: Barber;
  user?: User;
  service?: Service;
}

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    {
      text: string;
      variant: "warning" | "success" | "destructive" | "default" | "outline";
    }
  > = {
    pending: { text: "En attente", variant: "warning" },
    confirmed: { text: "Confirmé", variant: "success" },
    cancelled: { text: "Annulé", variant: "destructive" },
    done: { text: "Terminé", variant: "default" },
  };

  const statusConfig = config[status] || {
    text: status,
    variant: "outline" as const,
  };
  return <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>;
};

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
    icon: <CalendarIcon className="w-5 h-5" />,
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

const AllReservation = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchClientReservations = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/barber/reservations");
        setReservations(response.data.data);
      } catch (err) {
        console.error("Error fetching client reservations:", err);
        setError("Erreur lors du chargement des réservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientReservations();
  }, []);

  // Add this function for status update
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
    } catch (err) {
      setError("Impossible de mettre à jour le statut.");
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameFilterLower = nameFilter.toLowerCase();
      const emailFilterLower = emailFilter.toLowerCase();

      // Recherche générale
      const matchesSearchTerm =
        !searchTerm ||
        reservation.barber?.firstname
          ?.toLowerCase()
          .includes(searchTermLower) ||
        reservation.barber?.lastname?.toLowerCase().includes(searchTermLower) ||
        reservation.barber?.email?.toLowerCase().includes(searchTermLower) ||
        reservation.barber?.phone?.includes(searchTerm) ||
        reservation.service?.name?.toLowerCase().includes(searchTermLower) ||
        reservation.user?.name?.toLowerCase().includes(searchTermLower) ||
        reservation.user?.email?.toLowerCase().includes(searchTermLower);

      // Filtres spécifiques
      const matchesNameFilter =
        !nameFilter ||
        reservation.barber?.firstname
          ?.toLowerCase()
          .includes(nameFilterLower) ||
        reservation.barber?.lastname?.toLowerCase().includes(nameFilterLower) ||
        reservation.user?.name?.toLowerCase().includes(nameFilterLower);

      const matchesEmailFilter =
        !emailFilter ||
        reservation.barber?.email?.toLowerCase().includes(emailFilterLower) ||
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg text-muted-foreground">
          Chargement de vos réservations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8 bg-background text-foreground min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Toutes les Réservations
          </CardTitle>
          <CardDescription>
            Gestion et suivi de toutes les réservations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Barre de recherche et filtres */}
          <div className="space-y-4">
            {/* Recherche générale */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher dans toutes les réservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres avancés */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filtre par nom */}
              <div className="flex-1">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Filtrer par nom (barbier/client)..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtre par email */}
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

              {/* Filtre par statut */}
              <div className="flex-1 sm:max-w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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

              {/* Bouton reset filtres */}
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

            {/* Indicateur de résultats */}
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
                          <span className="text-sm">Recherche générale</span>
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
                          <StatusBadge status={statusFilter} />
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Aucune réservation trouvée */}
          {filteredReservations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? `Aucune réservation trouvée pour "${searchTerm}".`
                : "Vous n'avez aucune réservation pour le moment."}
            </p>
          ) : (
            <div className="grid gap-4">
              {filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Left: Client & Barber Info */}
                    <div className="flex-1 flex flex-col gap-2">
                      {/* Service */}
                      <div className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
                        <CalendarIcon className="w-5 h-5" />
                        {reservation.service?.name || "Service inconnu"}
                        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                          {reservation.service?.price ? `${reservation.service.price} MAD` : ""}
                        </span>
                      </div>
                      {/* Date & Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(reservation.reservation_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(reservation.reservation_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {/* Client */}
                      {reservation.user && (
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{reservation.user.name}</span>
                          <span className="text-xs text-gray-400">
                            {reservation.user.email}
                          </span>
                        </div>
                      )}
                      {/* Barber */}
                      {reservation.barber && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Barbier:</span>
                          <span className="font-medium">
                            {reservation.barber.firstname} {reservation.barber.lastname}
                          </span>
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">{reservation.barber.email}</span>
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">{reservation.barber.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Status Stepper & Actions */}
                    <div className="flex flex-col items-end gap-2 min-w-[220px]">
                      <StatusStepper
                        status={reservation.status}
                        onStepClick={async (newStatus) => {
                          if (newStatus !== reservation.status) {
                            await updateStatus(reservation.id, newStatus);
                          }
                        }}
                        disabled={
                          reservation.status === "done" ||
                          reservation.status === "cancelled"
                        }
                      />

                      {/* Modern Confirm/Cancel Buttons */}
                      {reservation.status !== "done" &&
                        reservation.status !== "cancelled" && (
                          <div className="flex gap-2 mt-2">
                            {reservation.status === "pending" && (
                              <Button
                                className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-md hover:scale-105 hover:brightness-110 transition"
                                onClick={() => updateStatus(reservation.id, "confirmed")}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Confirmer
                              </Button>
                            )}
                            {reservation.status === "confirmed" && (
                              <Button
                                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-full shadow-md hover:scale-105 hover:brightness-110 transition"
                                onClick={() => updateStatus(reservation.id, "done")}
                              >
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                Terminer
                              </Button>
                            )}
                            {reservation.status === "pending" && (
                              <Button
                                className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-full shadow-md hover:scale-105 hover:brightness-110 transition"
                                onClick={() => updateStatus(reservation.id, "cancelled")}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Annuler
                              </Button>
                            )}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllReservation;


// "use client";

// import { useEffect, useState, useMemo } from "react";
// import axiosClient from "@/api/axios";
// import {
//   Clock,
//   Calendar,
//   Mail,
//   Phone,
//   Search,
//   Filter,
//   X,
//   Users,
//   AtSign,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Calendar as CalendarIcon,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// // Types
// interface Barber {
//   id: number;
//   firstname: string;
//   lastname: string;
//   email: string;
//   phone: string;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface Service {
//   id: number;
//   name: string;
//   price: number;
// }

// interface Reservation {
//   id: number;
//   barber_id: number;
//   user_id: number;
//   service_id: number;
//   reservation_time: string;
//   status: "pending" | "confirmed" | "cancelled" | "done";
//   barber?: Barber;
//   user?: User;
//   service?: Service;
// }

// // Badge de statut
// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<
//     string,
//     {
//       text: string;
//       variant: "warning" | "success" | "destructive" | "default" | "outline";
//     }
//   > = {
//     pending: { text: "En attente", variant: "warning" },
//     confirmed: { text: "Confirmé", variant: "success" },
//     cancelled: { text: "Annulé", variant: "destructive" },
//     done: { text: "Terminé", variant: "default" },
//   };

//   const statusConfig = config[status] || {
//     text: status,
//     variant: "outline" as const,
//   };
//   return <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>;
// };

// // Status steps for the stepper
// const STATUS_STEPS = [
//   {
//     key: "pending",
//     label: "En attente",
//     icon: <AlertCircle className="w-5 h-5" />,
//     color: "from-gray-900 to-yellow-400",
//   },
//   {
//     key: "confirmed",
//     label: "Confirmé",
//     icon: <CheckCircle className="w-5 h-5" />,
//     color: "from-gray-900 to-green-400",
//   },
//   {
//     key: "done",
//     label: "Terminé",
//     icon: <CalendarIcon className="w-5 h-5" />,
//     color: "from-gray-900 to-blue-400",
//   },
//   {
//     key: "cancelled",
//     label: "Annulé",
//     icon: <XCircle className="w-5 h-5" />,
//     color: "from-gray-900 to-red-400",
//   },
// ];

// // Stepper component
// const StatusStepper = ({
//   status,
//   onStepClick,
//   disabled,
// }: {
//   status: "pending" | "confirmed" | "cancelled" | "done";
//   onStepClick?: (newStatus: "pending" | "confirmed" | "cancelled" | "done") => void;
//   disabled?: boolean;
// }) => {
//   const activeIdx = STATUS_STEPS.findIndex((s) => s.key === status);

//   return (
//     <div className="flex items-center gap-2 w-full justify-center py-2">
//       {STATUS_STEPS.filter(
//         (step) =>
//           step.key !== "cancelled" || status === "cancelled"
//       ).map((step, idx, arr) => {
//         const isActive = status === step.key;
//         const isCompleted = activeIdx > idx;
//         return (
//           <div key={step.key} className="flex items-center flex-1">
//             <button
//               disabled={
//                 disabled ||
//                 isActive ||
//                 (step.key === "cancelled" && status !== "pending")
//               }
//               onClick={() => onStepClick && onStepClick(step.key as any)}
//               className={`
//                 rounded-full p-2 shadow-lg
//                 bg-gradient-to-br ${step.color}
//                 ${isActive ? "ring-4 ring-yellow-300 scale-110" : ""}
//                 ${isCompleted ? "opacity-70" : ""}
//                 text-white transition-all
//                 focus:outline-none
//                 ${
//                   disabled ||
//                   isActive ||
//                   (step.key === "cancelled" && status !== "pending")
//                     ? "cursor-not-allowed opacity-60"
//                     : "hover:scale-105"
//                 }
//               `}
//               title={step.label}
//               type="button"
//             >
