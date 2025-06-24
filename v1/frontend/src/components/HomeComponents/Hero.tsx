import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
      <div className="relative z-10 py-24 px-6 text-center max-w-6xl mx-auto">
        <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
          Barbier Professionnel depuis 2015
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-emerald-200 bg-clip-text text-transparent">
          Barber Pro
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto leading-relaxed">
          L'art du barbier traditionnel avec une touche moderne. 
          Révélez votre style avec nos experts certifiés.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-4 text-lg font-semibold shadow-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Prendre Rendez-vous
          </Button>
          <Button variant="outline" size="lg" className="border-white/80 text-black hover:bg-white hover:text-blue-900 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-blue-900 px-8 py-4 text-lg">
            Voir nos Services
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">500+</div>
            <div className="text-blue-200 dark:text-blue-300">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">8+</div>
            <div className="text-blue-200 dark:text-blue-300">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">4.9/5</div>
            <div className="text-blue-200 dark:text-blue-300">Note Google</div>
          </div>
        </div>
      </div>
    </section>
  );
}
