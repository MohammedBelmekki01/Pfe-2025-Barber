import axiosClient from "@/api/axios";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  Scissors,
  Clock,
  User,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  image?: string | null;
}

interface ServiceItem {
  id: number;
  barber_id: number;
  name: string;
  description: string;
  price: string; // string from API, e.g., "80.00"
  duration: number;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
  barber?: Barber;
}

export default function AllServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Advanced filters
  const [filters, setFilters] = useState({
    serviceName: "",
    barberFirst: "",
    priceMin: "",
    priceMax: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const toNumber = (v: string | number | null | undefined): number => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === "number") return v;
    const n = parseFloat(String(v).replace(",", "."));
    return isNaN(n) ? NaN : n;
  };

  const getInitials = (first?: string, last?: string) =>
    `${first?.[0] || "?"}${last?.[0] || ""}`.toUpperCase();

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Optionally send serviceName to backend as a generic search
      const params: Record<string, string> = {};
      if (filters.serviceName.trim())
        params.search = filters.serviceName.trim();

      const res = await axiosClient.get("/api/admin/services", { params });
      const list: ServiceItem[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setServices(list);
    } catch (error) {
      console.error("Erreur chargement services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived filtered list (client-side advanced filtering)
  const filtered = useMemo(() => {
    const min = toNumber(filters.priceMin);
    const max = toNumber(filters.priceMax);
    const byName = filters.serviceName.trim().toLowerCase();
    const byBarber = filters.barberFirst.trim().toLowerCase();

    return services.filter((s) => {
      // service name contains
      if (byName && !s.name.toLowerCase().includes(byName)) return false;

      // barber firstname contains
      const bf = s.barber?.firstname ? s.barber.firstname.toLowerCase() : "";
      if (byBarber && !bf.includes(byBarber)) return false;

      // price range
      const price = toNumber(s.price);
      if (!isNaN(min) && price < min) return false;
      if (!isNaN(max) && price > max) return false;

      return true;
    });
  }, [services, filters]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  const clearFilters = () =>
    setFilters({
      serviceName: "",
      barberFirst: "",
      priceMin: "",
      priceMax: "",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore and manage all barbershop services
          </p>
        </div>

        {/* Advanced Filters */}
        <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Advanced Filters
            </CardTitle>
            <CardDescription>
              Filter services by name, barber first name, and price range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Service Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Service Name
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by service name..."
                    value={filters.serviceName}
                    onChange={(e) =>
                      updateFilter("serviceName", e.target.value)
                    }
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Barber First Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Barber First Name
                </label>
                <Input
                  placeholder="e.g., John"
                  value={filters.barberFirst}
                  onChange={(e) => updateFilter("barberFirst", e.target.value)}
                />
              </div>

              {/* Price Min */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Min (MAD)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={filters.priceMin}
                  onChange={(e) => updateFilter("priceMin", e.target.value)}
                />
              </div>

              {/* Price Max */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Max (MAD)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={filters.priceMax}
                  onChange={(e) => updateFilter("priceMax", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={fetchServices}>Refresh</Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <Card className="shadow-xl border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              All Services ({filtered.length})
            </CardTitle>
            <CardDescription>
              Browse available services with details and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading services...
                  </p>
                </div>
              </div>
            ) : current.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No services found
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {current.map((service) => (
                  <Card
                    key={service.id}
                    className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {service.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/${
                          service.image
                        }`}
                        alt={service.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <Scissors className="w-10 h-10 text-blue-500" />
                      </div>
                    )}
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Clock className="w-4 h-4" /> {service.duration} min
                        </Badge>
                        <Badge className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <DollarSign className="w-4 h-4" />{" "}
                          {toNumber(service.price)} MAD
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Avatar className="w-9 h-9 border-2 border-blue-200">
                          <AvatarImage
                            src={
                              service.barber?.image
                                ? `${
                                    import.meta.env.VITE_BACKEND_URL
                                  }/storage/${service.barber.image}`
                                : ""
                            }
                            alt={`${service.barber?.firstname || ""} ${
                              service.barber?.lastname || ""
                            }`}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                            {getInitials(
                              service.barber?.firstname,
                              service.barber?.lastname
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4" />
                            <span>
                              {service.barber?.firstname}{" "}
                              {service.barber?.lastname}
                            </span>
                          </div>
                          {service.created_at && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Added{" "}
                              {format(
                                new Date(service.created_at),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
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
      </div>
    </div>
  );
}
