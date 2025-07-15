import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axiosClient from "@/api/axios";
import debounce from "lodash.debounce";


const StatusBadge = ({ status }) => {
  const configs = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
      text: "En attente",
    },
    confirmed: {
      color: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
      text: "Confirmé",
    },
    cancelled: {
      color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
      text: "Annulé",
    },
  };
  const config = configs[status] || configs.pending;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  );
};

export default function AllReservationBarber() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("client"); // or "barber"
  const [filterText, setFilterText] = useState("");

  // Fetch reservations from API with optional filters
  const fetchReservations = (filterTypeParam, filterTextParam) => {
    setLoading(true);
    axiosClient
      .get("/api/admin/reservations", {
        params: filterTextParam
          ? { filterType: filterTypeParam, filterText: filterTextParam }
          : {},
      })
      .then((res) => {
        const formatted = res.data.data.map((r) => ({
          id: r.id,
          client: r.user?.name ?? "Client inconnu",
          barber: r.barber
            ? `${r.barber.firstname} ${r.barber.lastname}`
            : "Barbier inconnu",
          service: r.service,
          date: new Date(r.reservation_time).toLocaleDateString(),
          time: new Date(r.reservation_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: r.status,
        }));
        setAppointments(formatted);
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  };

  // Debounce API call when filter changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((type, text) => {
      fetchReservations(type, text);
    }, 500),
    []
  );

  useEffect(() => {
    if (filterText.trim() === "") {
      fetchReservations("", "");
    } else {
      debouncedFetch(filterType, filterText);
    }
  }, [filterText, filterType, debouncedFetch]);

  const updateStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">All Rservations</h1>

      {/* Filter controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 max-w-md">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="client">Filtrer par client</option>
          <option value="barber">Filtrer par barbier</option>
        </select>

        <input
          type="text"
          placeholder={`Rechercher par ${filterType === "client" ? "client" : "barbier"}`}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="flex-grow rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Reservations list */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10 transition-colors">
        <h2 className="text-xl font-semibold mb-4">Rendez-vous récents</h2>

        {loading ? (
          <p className="text-center text-gray-500">Chargement des rendez-vous...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">Aucun rendez-vous trouvé.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="font-semibold">
                    {appt.client} avec {appt.barber}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">{appt.service}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {appt.date} à {appt.time}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <StatusBadge status={appt.status} />

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
