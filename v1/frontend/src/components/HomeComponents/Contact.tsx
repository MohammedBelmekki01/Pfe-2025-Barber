import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Contact() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Contact</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Nous Trouver</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Venez nous rendre visite dans notre salon moderne
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-emerald-500/10 transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Adresse</h3>
                    <p className="text-gray-600 dark:text-gray-300">123 Avenue Mohammed V</p>
                    <p className="text-gray-600 dark:text-gray-300">Casablanca, Maroc</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-blue-500/10 transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Téléphone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+212 6 XX XX XX XX</p>
                    <p className="text-gray-600 dark:text-gray-300">+212 5 XX XX XX XX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-purple-500/10 transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Horaires</h3>
                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
                      <p>Lun - Ven: 9h00 - 19h00</p>
                      <p>Samedi: 9h00 - 20h00</p>
                      <p>Dimanche: 10h00 - 18h00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl h-96 flex items-center justify-center shadow-lg">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Carte Google Maps</p>
          </div>
        </div>
      </div>
    </section>
  );
}
