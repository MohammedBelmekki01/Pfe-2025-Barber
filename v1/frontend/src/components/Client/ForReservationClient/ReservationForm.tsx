import { useState } from 'react';
import axiosClient from '@/api/axios';
import { useUsercontext } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ReservationFormProps {
  barberId: number;
}

export default function ReservationForm({ barberId }: ReservationFormProps) {
  const { user } = useUsercontext();
  const [service, setService] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError(null);
    setSuccess('');

    if (!service.trim() || !reservationDate.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        barber_id: barberId,
        service,
        reservation_time: reservationDate,
      };

      await axiosClient.post('/api/client/reservations', payload);
      setService('');
      setReservationDate('');
      toast.success("Reservation created successfully")
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-900 shadow rounded-lg space-y-4 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Make a Reservation</h2>

      <Input
        type="datetime-local"
        value={reservationDate}
        onChange={(e) => setReservationDate(e.target.value)}
        placeholder="Select date and time"
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
      />

      <Input
        type="text"
        value={service}
        onChange={(e) => setService(e.target.value)}
        placeholder="Service (e.g., Haircut, Beard Trim)"
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
      />

      <Button
        onClick={handleSubmit}
        disabled={loading || !service || !reservationDate}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Reserve'}
      </Button>

      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>}
    </div>
  );
}
