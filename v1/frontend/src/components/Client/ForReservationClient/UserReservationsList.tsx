import { useEffect, useState } from 'react';
import axiosClient from '@/api/axios';
import { useUsercontext } from '@/context/UserContext';
import { Calendar, Clock, Mail, Phone, MapPin, BadgeCheck, User, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    pending: { text: "En attente", variant: "secondary" as const },
    confirmed: { text: "Confirmée", variant: "default" as const },
    cancelled: { text: "Annulée", variant: "destructive" as const },
    done: { text: "Terminée", variant: "outline" as const },
  }[status] || { text: status, variant: "outline" as const }
  
  return <Badge variant={config.variant}>{config.text}</Badge>
}

interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  bio?: string;
  image?: string;
}

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  image?: string;
}

interface Reservation {
  id: number;
  barber_id: number;
  service_id: number;
  reservation_time: string;
  status: string;
  created_at: string;
  barber: Barber | null; // 🔧 FIX: Permettre null
  service: Service | null; // 🔧 FIX: Permettre null
}

export default function UserReservationsList() {
  const { user } = useUsercontext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // États pour les filtres
  const [selectedBarber, setSelectedBarber] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  
  const reservationsPerPage = 6;

  // 🔧 FIX: Listes pour les filtres avec vérifications de sécurité
  const uniqueBarbers = reservations.reduce((acc, res) => {
    // Vérifier que barber existe et a un id
    if (res.barber && res.barber.id) {
      const barberId = res.barber.id.toString();
      if (!acc.find(b => b.id === barberId)) {
        acc.push({
          id: barberId,
          name: `${res.barber.firstname || ''} ${res.barber.lastname || ''}`.trim() || 'Barbier inconnu'
        });
      }
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  const uniqueServices = reservations.reduce((acc, res) => {
    // Vérifier que service existe et a un id
    if (res.service && res.service.id) {
      const serviceId = res.service.id.toString();
      if (!acc.find(s => s.id === serviceId)) {
        acc.push({
          id: serviceId,
          name: res.service.name || 'Service inconnu'
        });
      }
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'done', label: 'Terminé' }
  ];

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axiosClient
      .get('/api/client/reservations')
      .then((response) => {
        console.log('Reservations data:', response.data); // 🔧 DEBUG: Vérifier la structure des données
        setReservations(response.data);
        setFilteredReservations(response.data);
      })
      .catch((err) => {
        console.error('Error fetching reservations:', err); // 🔧 DEBUG
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // 🔧 FIX: Effet pour filtrer les réservations avec vérifications de sécurité
  useEffect(() => {
    let filtered = reservations;

    // Filtrer par barbier
    if (selectedBarber !== 'all') {
      filtered = filtered.filter(res => 
        res.barber && res.barber.id && res.barber.id.toString() === selectedBarber
      );
    }

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(res => res.status === selectedStatus);
    }

    // Filtrer par service
    if (selectedService !== 'all') {
      filtered = filtered.filter(res => 
        res.service && res.service.id && res.service.id.toString() === selectedService
      );
    }

    setFilteredReservations(filtered);
    setCurrentPage(1); // Reset à la première page après filtrage
  }, [selectedBarber, selectedStatus, selectedService, reservations]);

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedBarber('all');
    setSelectedStatus('all');
    setSelectedService('all');
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = selectedBarber !== 'all' || selectedStatus !== 'all' || selectedService !== 'all';

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des rendez-vous...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  if (!reservations.length) {
    return (
      <div className="text-center p-8">
        <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Aucun rendez-vous
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Vous n'avez aucun rendez-vous pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec titre et compteur */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Mes rendez-vous ({filteredReservations.length}/{reservations.length})
        </h2>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>

      {/* Système de filtres */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtres</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par barbier */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Barbier
            </label>
            <Select value={selectedBarber} onValueChange={setSelectedBarber}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les barbiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les barbiers</SelectItem>
                {uniqueBarbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par statut */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Statut
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par service */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Service
            </label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                {uniqueServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Badges des filtres actifs */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {selectedBarber !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Barbier : {uniqueBarbers.find(b => b.id === selectedBarber)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedBarber('all')}
                />
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Statut : {statusOptions.find(s => s.value === selectedStatus)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedStatus('all')}
                />
              </Badge>
            )}
            {selectedService !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Service : {uniqueServices.find(s => s.id === selectedService)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedService('all')}
                />
              </Badge>
            )}
          </div>
        )}
      </Card>

      {/* Message si aucun résultat après filtrage */}
      {filteredReservations.length === 0 && reservations.length > 0 && (
        <div className="text-center p-8">
          <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Aucun rendez-vous trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Aucun rendez-vous ne correspond aux filtres sélectionnés.
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Grille des réservations */}
      {filteredReservations.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {currentReservations.map((res) => (
            <Card key={res.id} className="overflow-hidden border hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={res.service?.image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${res.service.image}` : undefined} 
                      alt={res.service?.name || "Service"} 
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {res.service?.name?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight">
                      {res.service?.name || "Service inconnu"}
                    </h3>
                    {res.service?.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {res.service.description}
                      </p>
                    )}
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span>{res.service?.price || 0} MAD</span>
                      <span>•</span>
                      <span>{res.service?.duration || 0} min</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Date et heure */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(res.reservation_time), 'dd/MM/yyyy')}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {format(new Date(res.reservation_time), 'HH:mm')}
                  </div>
                </div>

                {/* Statut */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={res.status} />
                  <span className="text-xs text-muted-foreground">
                    Réservé le {format(new Date(res.created_at), 'dd/MM/yyyy')}
                  </span>
                </div>

                {/* Infos du barbier */}
                {res.barber ? (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          res.barber.image
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/${res.barber.image}`
                            : "/badgebarber.jpg"
                        }
                        alt={`${res.barber.firstname || ''} ${res.barber.lastname || ''}`.trim() || 'Barbier'}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.currentTarget.src = "/badgebarber.jpg";
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {`${res.barber.firstname || ''} ${res.barber.lastname || ''}`.trim() || 'Barbier inconnu'}
                        </div>
                        
                        <div className="space-y-1 mt-1">
                          {res.barber.email && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {res.barber.email}
                            </div>
                          )}
                          
                          {res.barber.phone && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {res.barber.phone}
                            </div>
                          )}
                          
                          {res.barber.location && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {res.barber.location}
                            </div>
                          )}
                          
                          {res.barber.experience && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <BadgeCheck className="mr-1 h-3 w-3" />
                              {res.barber.experience}
                            </div>
                          )}
                        </div>
                        
                        {res.barber.bio && (
                          <p className="text-xs text-muted-foreground italic mt-2 line-clamp-2">
                            {res.barber.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-3 text-center text-sm text-muted-foreground">
                    Informations du barbier non disponibles
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
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) paginate(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink 
                  href="#" 
                  isActive={i + 1 === currentPage} 
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(i + 1);
                  }}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) paginate(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}