import { useEffect, useState } from 'react';
import axiosClient from '@/api/axios';
import { useUsercontext } from '@/context/UserContext';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Barber {
  id: number;
  firstname: string;
  lastname: string;
}

interface Reservation {
  id: number;
  barber_id: number;
  service: string;
  reservation_time: string;
  barber: Barber;
}

export default function UserReservationsList() {
  const { user } = useUsercontext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    axiosClient
      .get('/api/client/reservations')
      .then((response) => {
        setReservations(response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Chargement des rendez-vous...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!reservations.length)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center p-6">
        Vous n’avez aucun rendez-vous pour le moment.
      </div>
    );

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Mes Rendez-vous 
      </h2>
      <div className="space-y-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="p-4 border-l-4 border-blue-600 bg-white dark:bg-gray-800 shadow-sm rounded-r-lg"
          >
            <div className="flex flex-wrap justify-between items-start mb-2">
              <div>
                <p className="text-md font-medium text-gray-900 dark:text-gray-100">
                  {res.service}
                </p>
                {res.barber && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Avec {res.barber.firstname} {res.barber.lastname}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(res.reservation_time), 'PPP')}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(res.reservation_time), 'p')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
