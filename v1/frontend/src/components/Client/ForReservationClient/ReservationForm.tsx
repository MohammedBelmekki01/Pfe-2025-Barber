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
  const [error, setError] = useState<string | null>(null);

  // Fetch services for this barber
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosClient.get(`/api/barbers/${barberId}/services`);
        setServices(res.data.data); // Assuming data is an array of services
        console.log(res.data.data);
      } catch (err: any) {
        setError("Failed to load services");
      }
    };

    fetchServices();
  }, [barberId]);

  const handleSubmit = async () => {
    setError(null);

    if (!serviceId || !reservationDate.trim()) {
      setError("Please select a service and date/time");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
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
      toast.success("Reservation created successfully");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create reservation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-900 shadow rounded-lg space-y-4 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Make a Reservation
      </h2>

      <Input
        type="datetime-local"
        value={reservationDate}
        onChange={(e) => setReservationDate(e.target.value)}
        placeholder="Select date and time"
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
      />

      <Select value={serviceId} onValueChange={setServiceId}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
          <SelectValue placeholder="Select a service" />
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
        {loading ? "Submitting..." : "Reserve"}
      </Button>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
