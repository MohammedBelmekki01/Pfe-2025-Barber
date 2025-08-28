import React, { useEffect, useState } from "react";
import {
  Bell,
  User,
  Calendar,
  Star,
  Phone,
  MapPin,
  Mail,
  BadgeCheck,
} from "lucide-react";
import axiosClient from "@/api/axios";
import { useUsercontext } from "@/context/UserContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const StatusBadge = ({ status }) => {
  const configs = {
    pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200", text: "En attente" },
    confirmed: { color: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200", text: "Confirmé" },
    cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200", text: "Annulé" },
    done: { color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200", text: "Terminé" },
  };
  const config = configs[status] || configs.pending;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

export default function ClientDashboard() {
  const { user } = useUsercontext();

  // Reservations state
  const [reservations, setReservations] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);
  const [errorRes, setErrorRes] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 4;

  // Barbers state
  const [barbers, setBarbers] = useState([]);
  const [loadingBarber, setLoadingBarber] = useState(false);
  const [errorBarber, setErrorBarber] = useState<string | null>(null);
  const [barberPage, setBarberPage] = useState(1);
  const barbersPerPage = 4;

  useEffect(() => {
    setLoadingRes(true);
    axiosClient
      .get('/api/client/reservations')
      .then((response) => setReservations(response.data))
      .catch((err) => setErrorRes(err.response?.data?.message || err.message))
      .finally(() => setLoadingRes(false));
  }, []);

  useEffect(() => {
    setLoadingBarber(true);
    axiosClient
      .get("/api/client/barbers")
      .then((response) => setBarbers(response.data.data))
      .catch((err) => setErrorBarber(err.response?.data?.message || err.message))
      .finally(() => setLoadingBarber(false));
  }, []);

  // Pagination logic for reservations
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Pagination logic for barbers
  const indexOfLastBarber = barberPage * barbersPerPage;
  const indexOfFirstBarber = indexOfLastBarber - barbersPerPage;
  const currentBarbers = barbers.slice(indexOfFirstBarber, indexOfLastBarber);
  const totalBarberPages = Math.ceil(barbers.length / barbersPerPage);

  const paginateBarber = (pageNumber: number) => setBarberPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img
                src={
                  user?.image
                    ? `${import.meta.env.VITE_BACKEND_URL}/storage/${user.image}`
                    : "/badgebarber.jpg"
                }
                alt={user?.firstname}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-blue-600 dark:border-blue-400"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </h1>
                <div className="flex flex-col space-y-1 mt-1 text-gray-600 dark:text-gray-400 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{user?.phone || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user?.addrees || "Non renseignée"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-400 dark:text-gray-400" />
              <User className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100">
        {/* Quick Action */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold mb-2">Prendre un Rendez-vous</h2>
                <p className="text-blue-100">
                  Réservez votre prochain service en quelques clics
                </p>
              </div>
              <Link to="/client/barbers">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Réserver Maintenant
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Mes Rendez-vous
                </h2>
              </CardHeader>
              <CardContent>
                {loadingRes ? (
                  <p>Chargement des rendez-vous...</p>
                ) : errorRes ? (
                  <p className="text-red-600">{errorRes}</p>
                ) : !reservations.length ? (
                  <div className="text-gray-500 dark:text-gray-400 text-center p-6">
                    Vous n’avez aucun rendez-vous pour le moment.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {currentReservations.map((res) => (
                        <Card key={res.id} className="overflow-hidden border hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={res.service?.image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${res.service.image}` : "/placeholder.svg"} alt={res.service?.name} />
                                <AvatarFallback>
                                  {res.service?.name?.charAt(0) || <User className="h-6 w-6 text-muted-foreground" />}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-lg">{res.service?.name || "Service inconnu"}</div>
                                <div className="text-xs text-muted-foreground">{res.service?.description}</div>
                                <div className="text-xs text-muted-foreground">Prix: {res.service?.price} MAD</div>
                                <div className="text-xs text-muted-foreground">Durée: {res.service?.duration} min</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                {format(new Date(res.reservation_time), 'PPP')}
                                <span className="ml-2 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(res.reservation_time), 'p')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <StatusBadge status={res.status} />
                                <span className="ml-2 text-xs">Réservé le {format(new Date(res.created_at), 'PPP')}</span>
                              </div>
                              <div className="mt-2">
                                <div className="font-semibold text-sm">Barbier</div>
                                <div className="text-xs text-muted-foreground">
                                  {res.barber?.firstname} {res.barber?.lastname}
                                </div>
                                {res.barber?.email && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Mail className="mr-1 h-3 w-3" />
                                    {res.barber.email}
                                  </div>
                                )}
                                {res.barber?.phone && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Phone className="mr-1 h-3 w-3" />
                                    {res.barber.phone}
                                  </div>
                                )}
                                {res.barber?.location && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {res.barber.location}
                                  </div>
                                )}
                                {res.barber?.experience && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <BadgeCheck className="mr-1 h-3 w-3" />
                                    Expérience: {res.barber.experience}
                                  </div>
                                )}
                                {res.barber?.bio && (
                                  <div className="text-xs italic text-muted-foreground mt-1">
                                    {res.barber.bio}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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

          {/* Barbers List */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Tous les Barbiers
                </h2>
              </CardHeader>
              <CardContent>
                {loadingBarber ? (
                  <p>Chargement des barbiers...</p>
                ) : errorBarber ? (
                  <p className="text-red-600">{errorBarber}</p>
                ) : !barbers.length ? (
                  <p>Aucun barbier trouvé.</p>
                ) : (
                  <>
                    <div className="grid gap-4">
                      {currentBarbers.map((barber) => (
                        <Link
                          key={barber.id}
                          to={`/client/barber-details?id=${barber.id}`}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition"
                        >
                          <img
                            src={
                              barber?.image
                                ? `${import.meta.env.VITE_BACKEND_URL}/storage/${barber?.image}`
                                : "/badgebarber.jpg"
                            }
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {barber.firstname} {barber.lastname}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {barber.rating ?? "Pas d'avis"}
                              </span>
                            </div>
                          </div>
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </Link>
                      ))}
                    </div>
                    {/* Pagination for barbers */}
                    {totalBarberPages > 1 && (
                      <Pagination className="mt-8">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={() => paginateBarber(barberPage - 1)}
                              className={barberPage === 1 ? "pointer-events-none opacity-50" : undefined}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalBarberPages }, (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink href="#" isActive={i + 1 === barberPage} onClick={() => paginateBarber(i + 1)}>
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={() => paginateBarber(barberPage + 1)}
                              className={barberPage === totalBarberPages ? "pointer-events-none opacity-50" : undefined}
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
        </div>
      </div>
    </div>
  );
}