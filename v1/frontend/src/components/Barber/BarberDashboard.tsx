import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, Users, Scissors, Star, Settings, Bell,
  DollarSign, Plus, Edit, CheckCircle, XCircle, MapPin,
  Sun, Moon
} from "lucide-react";

// ✅ Mock data
const mockData = {
  barber: {
    firstname: "Ahmed",
    lastname: "Benali",
    location: "Casablanca, Maroc",
    profile_photo: "/api/placeholder/50/50",
  },
  todayStats: {
    appointments: 8,
    revenue: 960,
    rating: 4.8,
    regularClients: 67,
  },
  appointments: [
    {
      id: 1,
      client: "Mohamed Alami",
      service: "Coupe Classique",
      time: "10:00",
      status: "confirmed",
      phone: "+212 6 11 22 33 44",
    },
    {
      id: 2,
      client: "Youssef Karimi",
      service: "Coupe + Barbe",
      time: "14:30",
      status: "pending",
      phone: "+212 6 55 66 77 88",
    },
  ],
  services: [
    { id: 1, name: "Coupe Classique", price: 80, duration: 30 },
    { id: 2, name: "Barbe + Moustache", price: 50, duration: 20 },
  ],
  reviews: [
    {
      id: 1,
      client: "Ahmed S.",
      rating: 5,
      comment: "Excellent service!",
      date: "2025-06-20",
    },
    {
      id: 2,
      client: "Omar K.",
      rating: 4,
      comment: "Bonne coupe, ambiance sympa.",
      date: "2025-06-18",
    },
  ],
};

// ✅ Color classes
const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
  purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
};

// ✅ Reusable components
const DashboardCard = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
  <DashboardCard>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className={`p-4 rounded-full ${colorClasses[color]}`}>
        <Icon className="h-8 w-8" />
      </div>
    </div>
  </DashboardCard>
);

const StatusBadge = ({ status }) => {
  const configs = {
    pending: { color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200", text: "En attente" },
    confirmed: { color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200", text: "Confirmé" },
    cancelled: { color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200", text: "Annulé" },
    done: { color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200", text: "Terminé" },
  };
  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

// ✅ Main Component
const BarberDashboard = () => {

  const updateAppointmentStatus = (id, newStatus) => {
    console.log(`Updating appointment #${id} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={mockData.barber.profile_photo} className="w-12 h-12 rounded-full border border-blue-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockData.barber.firstname} {mockData.barber.lastname}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {mockData.barber.location}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">

          <Bell className="h-6 w-6 text-gray-400 dark:text-gray-300" />
          <Settings className="h-6 w-6 text-gray-400 dark:text-gray-300" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Calendar} title="Rdv Aujourd'hui" value={mockData.todayStats.appointments} subtitle="+2 vs hier" color="blue" />
          <StatCard icon={DollarSign} title="Revenus" value={`${mockData.todayStats.revenue} MAD`} subtitle="+12% sem." color="green" />
          <StatCard icon={Star} title="Note Moyenne" value={mockData.todayStats.rating} subtitle="Basé sur 124 avis" color="yellow" />
          <StatCard icon={Users} title="Clients réguliers" value={mockData.todayStats.regularClients} subtitle="+5 ce mois" color="purple" />
        </div>

        {/* Appointments + Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardCard>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rdv du jour</h2>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4 mr-2" /> Nouveau
                </button>
              </div>

              <div className="space-y-4">
                {mockData.appointments.map((a) => (
                  <div key={a.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{a.client}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{a.service}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{a.time}</p>
                      <StatusBadge status={a.status} />
                      <div className="flex mt-2 space-x-2 justify-end">
                        <button onClick={() => updateAppointmentStatus(a.id, "confirmed")} className="text-green-600 hover:text-green-700">
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button onClick={() => updateAppointmentStatus(a.id, "cancelled")} className="text-red-600 hover:text-red-700">
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Services */}
          <div>
            <DashboardCard>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mes Services</h2>
                <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400 cursor-pointer" />
              </div>
              <div className="space-y-4">
                {mockData.services.map((s) => (
                  <div key={s.id} className="flex justify-between items-center border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{s.duration} min</p>
                    </div>
                    <p className="font-bold text-blue-600 dark:text-blue-400">{s.price} MAD</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
                Ajouter un Service
              </button>
            </DashboardCard>
          </div>
        </div>

        {/* Reviews */}
        <DashboardCard>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Avis Récents</h2>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="h-5 w-5" />
              <span className="font-semibold text-gray-900 dark:text-white">{mockData.todayStats.rating}</span>
              <span className="text-gray-500 dark:text-gray-400">(124 avis)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockData.reviews.map((r) => (
              <div key={r.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{r.client.charAt(0)}</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">{r.client}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{r.date}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default BarberDashboard;
