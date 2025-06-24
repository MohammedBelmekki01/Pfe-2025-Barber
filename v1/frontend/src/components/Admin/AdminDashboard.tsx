import React, { useState, useEffect } from "react";
import {
  Users,
  Scissors,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";

const mockData = {
  stats: {
    users: 150,
    barbers: 12,
    appointmentsToday: 25,
    revenueToday: 3500,
  },
  recentAppointments: [
    {
      id: 1,
      client: "Mohamed Alami",
      barber: "Ahmed Benali",
      service: "Coupe + Barbe",
      date: "2025-06-25",
      time: "14:30",
      status: "pending",
    },
    {
      id: 2,
      client: "Youssef Karimi",
      barber: "Karim Saadi",
      service: "Barbe + Moustache",
      date: "2025-06-25",
      time: "16:00",
      status: "confirmed",
    },
    {
      id: 3,
      client: "Sara El Amrani",
      barber: "Ahmed Benali",
      service: "Coupe Classique",
      date: "2025-06-26",
      time: "10:00",
      status: "cancelled",
    },
  ],
  barbers: [
    { id: 1, name: "Ahmed Benali", experience: 8, rating: 4.8 },
    { id: 2, name: "Karim Saadi", experience: 5, rating: 4.5 },
    { id: 3, name: "Youssef Karimi", experience: 6, rating: 4.6 },
  ],
  users: [
    { id: 1, name: "Mohamed Alami", email: "mohamed@example.com" },
    { id: 2, name: "Sara El Amrani", email: "sara@example.com" },
    { id: 3, name: "Youssef Karimi", email: "youssef@example.com" },
  ],
};

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

function AdminDashboard() {
  const [appointments, setAppointments] = useState(mockData.recentAppointments);




  const updateStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            icon: Users,
            label: "Utilisateurs",
            value: mockData.stats.users,
            iconColor: "text-blue-600",
          },
          {
            icon: Scissors,
            label: "Barbiers",
            value: mockData.stats.barbers,
            iconColor: "text-purple-600",
          },
          {
            icon: Calendar,
            label: "Rdv Aujourd'hui",
            value: mockData.stats.appointmentsToday,
            iconColor: "text-green-600",
          },
          {
            icon: DollarSign,
            label: "Revenus Aujourd'hui",
            value: `${mockData.stats.revenueToday} MAD`,
            iconColor: "text-yellow-600",
          },
        ].map(({ icon: Icon, label, value, iconColor }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Icon className={`h-10 w-10 ${iconColor}`} />
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-semibold">
                  {label}
                </p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10 transition-colors">
        <h2 className="text-xl font-semibold mb-4">Rendez-vous récents</h2>
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
                {appt.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(appt.id, "confirmed")}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition"
                      title="Confirmer"
                    >
                      <CheckCircle className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => updateStatus(appt.id, "cancelled")}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                      title="Annuler"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barbers List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10 transition-colors">
        <h2 className="text-xl font-semibold mb-4">Liste des Barbiers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expérience (années)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {mockData.barbers.map((barber) => (
                <tr key={barber.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{barber.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{barber.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{barber.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4">Liste des Utilisateurs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {mockData.users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
