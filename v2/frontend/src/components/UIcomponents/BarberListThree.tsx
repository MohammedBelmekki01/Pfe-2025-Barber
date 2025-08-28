import { useEffect, useState } from "react";
import axiosClient from "@/api/axios"; // Your axios instance
import { Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Barber {
  id: number;
  firstname: string;
  lastname: string;
  avatar?: string;
  rating?: number;
}

export default function BarberListAll() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosClient
      .get("/api/client/barbers") // fetch all barbers here
      .then((response) => {
        setBarbers(response.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur chargement barbiers:", err);
        setError("Erreur lors du chargement des barbiers");
      });
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  if (barbers.length === 0) return <p>Aucun barbier trouvé.</p>;

  return (
    <div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Tous les Barbiers
      </h2>
      <div className="space-y-4">
        {barbers.map((barber) => (
          <Link
            key={barber.id}
            to={`/client/barber-details?id=${barber.id}`}
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition"
          >
            <img
              src={barber.avatar || "/badgebarber.jpg"}
              alt="Barbier"
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

    </div>
  );
}
