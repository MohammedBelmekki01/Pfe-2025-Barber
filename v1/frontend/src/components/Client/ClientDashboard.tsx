import React, { useState, useEffect } from "react";
import {
  Bell,
  User,
  Calendar,
  Clock,
  MapPin,
  Star,
  Filter,
  Search,
  Sun,
  Moon,
} from "lucide-react";

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


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img
                src="/api/placeholder/40/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Mohamed Alami
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Client Premium
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-400 dark:text-gray-400" />
              <User className="h-5 w-5 text-gray-400 dark:text-gray-400" />

              {/* Dark Mode Toggle Button */}
             
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Mes Rendez-vous
                </h2>
                <div className="flex space-x-2">
                  <button className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900 rounded-r-lg">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Coupe + Barbe</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Avec Ahmed Benali
                      </p>
                    </div>
                    <StatusBadge status="confirmed" />
                  </div>
                  <div className="flex flex-wrap space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      25 Juin 2025
                    </span>
                    <span className="flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      14:30
                    </span>
                    <span className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Casablanca
                    </span>
                  </div>
                  <div className="flex flex-wrap space-x-2 mt-3">
                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 text-sm font-medium">
                      Modifier
                    </button>
                    <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 text-sm font-medium">
                      Annuler
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Coupe Classique</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Avec Youssef Karimi
                      </p>
                    </div>
                    <StatusBadge status="pending" />
                  </div>
                  <div className="flex flex-wrap space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      28 Juin 2025
                    </span>
                    <span className="flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      10:00
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Favorite Barbers */}
          <div>
            <DashboardCard>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Mes Barbiers Favoris
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Barbier"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Ahmed Benali</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">4.8</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Barbier"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Youssef Karimi</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">4.6</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button className="w-full mt-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Découvrir Plus de Barbiers
              </button>
            </DashboardCard>
          </div>
        </div>

        {/* History */}
        <div className="mt-8">
          <DashboardCard>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Historique des Services
            </h2>
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
