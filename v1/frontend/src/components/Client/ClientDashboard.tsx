import React from "react";
import {
  Bell,
  User,
  Calendar,
  Star,
  PhoneIcon,
  MapPin,
} from "lucide-react";
import UserReservationsList from "./ForReservationClient/UserReservationsList";
import BarberListThree from "../UIcomponents/BarberListThree";
import { useUsercontext } from "@/context/UserContext"; // adjust path to your user context

const DashboardCard = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 hover:shadow-md transition-shadow ${className}`}
  >
    {children}
  </div>
);

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
    done: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
      text: "Terminé",
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

const ClientDashboard = () => {
  const { user } = useUsercontext();

  // If user is not loaded or not authenticated, you can handle loading or redirect here
  if (!user) {
    return <p>Chargement de l'utilisateur...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
<div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <img
          src="/useravatar.png"
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-blue-600 dark:border-blue-400"
        />
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </h1>
          <div className="flex flex-col space-y-1 mt-1 text-gray-600 dark:text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-4 h-4" />
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
        {/* Bouton dark mode ou autre actions ici */}
      </div>
    </div>
  </div>
</div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100">
        {/* Quick Action */}
        <div className="mb-8">
          <DashboardCard className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold mb-2">Prendre un Rendez-vous</h2>
                <p className="text-blue-100">
                  Réservez votre prochain service en quelques clics
                </p>
              </div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Réserver Maintenant
              </button>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <DashboardCard>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Mes Rendez-vous
              </h2>
              <UserReservationsList />
            </DashboardCard>
          </div>

          {/* Barbers List */}
          <div>
            <BarberListThree />
          </div>
        </div>

        {/* History */}
        <div className="mt-8">
          <DashboardCard>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Historique des Services
            </h2>
            {/* You can dynamically fetch and display history here */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Barbier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avis
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      Coupe + Barbe
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Ahmed Benali
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      20 Juin 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      120 MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
