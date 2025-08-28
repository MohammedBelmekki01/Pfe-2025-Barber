import React from "react";
import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Booking() {
  return (
    <section className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 py-20 px-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt pour un nouveau look ?</h2>
        <p className="text-xl mb-8 opacity-90">
          Réservez votre créneau dès maintenant et laissez nos experts prendre soin de vous
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg">
            <Phone className="mr-2 h-5 w-5" />
            Appeler maintenant
          </Button>
          <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Réserver en ligne
          </Button>
        </div>
      </div>
    </section>
  );
}
