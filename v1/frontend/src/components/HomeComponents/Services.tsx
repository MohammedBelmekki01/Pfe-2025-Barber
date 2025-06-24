import React from "react";
import { Scissors, Star, Award, Users, Sparkles, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  { 
    name: "Coupe Classique", 
    description: "Style propre et professionnel pour toutes occasions", 
    price: "25€",
    duration: "45 min",
    icon: Scissors
  },
  { 
    name: "Barbe & Rasage", 
    description: "Rasage de précision et entretien de barbe", 
    price: "20€",
    duration: "30 min",
    icon: Sparkles
  },
  { 
    name: "Coupe Moderne", 
    description: "Tendances actuelles et coupes personnalisées", 
    price: "30€",
    duration: "60 min",
    icon: Star
  },
  { 
    name: "Coupe + Barbe", 
    description: "Forfait complet pour un look parfait", 
    price: "40€",
    duration: "75 min",
    icon: Award
  },
  { 
    name: "Coiffage Enfant", 
    description: "Coupes adaptées pour les plus jeunes", 
    price: "18€",
    duration: "30 min",
    icon: Users
  },
  { 
    name: "Entretien Barbe", 
    description: "Taille et mise en forme de votre barbe", 
    price: "15€",
    duration: "20 min",
    icon: CheckCircle
  },
];

export function Services() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Services Premium</Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Nos Services</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Des services de qualité professionnelle pour sublimer votre style
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white dark:bg-slate-800 hover:shadow-emerald-500/10">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">{service.name}</CardTitle>
              <div className="flex justify-center items-center gap-4 mt-2">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{service.price}</span>
                <Badge variant="outline" className="text-gray-600 dark:text-gray-300 dark:border-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {service.duration}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {service.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
