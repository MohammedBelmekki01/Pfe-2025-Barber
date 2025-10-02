import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { useUsercontext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ReservationFormProps {
  barberId: number;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

export default function ReservationForm({ barberId }: ReservationFormProps) {
  const { user } = useUsercontext();

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupérer les services pour ce barbier
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosClient.get(`/api/barbers/${barberId}/services`);
        setServices(res.data.data); // Supposé que data est un tableau de services
        console.log(res.data.data);
      } catch (err: any) {
        toast.error("Échec du chargement des services");
      }
    };

    fetchServices();
  }, [barberId]);

  const handleSubmit = async () => {
    if (!serviceId || !reservationDate.trim()) {
      toast.error("Veuillez sélectionner un service et une date/heure");
      return;
    }

    if (!user?.id) {
      toast.error("Utilisateur non authentifié");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        barber_id: barberId,
        service_id: Number(serviceId),
        reservation_time: reservationDate,
      };

      await axiosClient.post("/api/client/reservations", payload);
      setServiceId("");
      setReservationDate("");
      toast.success("Réservation créée avec succès");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Échec de la création de la réservation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-900 shadow rounded-lg space-y-4 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Prendre un rendez-vous
      </h2>

      <Input
        type="datetime-local"
        value={reservationDate}
        onChange={(e) => setReservationDate(e.target.value)}
        placeholder="Sélectionnez la date et l'heure"
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
      />

      <Select value={serviceId} onValueChange={setServiceId}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
          <SelectValue placeholder="Sélectionnez un service" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id.toString()}>
              {service.name} - {service.price} MAD
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleSubmit}
        disabled={loading || !serviceId || !reservationDate}
        className="w-full"
      >
        {loading ? "Envoi en cours..." : "Réserver"}
      </Button>
    </div>
  );
}
