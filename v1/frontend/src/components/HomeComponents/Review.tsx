import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reviews = [
  { 
    name: "Omar Khalil", 
    rating: 5, 
    comment: "Service impeccable ! Ahmed est un vrai professionnel. Je recommande vivement !",
    date: "Il y a 2 jours"
  },
  { 
    name: "Sara Mansouri", 
    rating: 5, 
    comment: "Barbier professionnel et sympa. Mon mari est très satisfait de sa coupe.",
    date: "Il y a 1 semaine"
  },
  { 
    name: "Karim Bennani", 
    rating: 4, 
    comment: "Excellent rapport qualité-prix. Ambiance conviviale et résultat au top.",
    date: "Il y a 2 semaines"
  },
  { 
    name: "Mehdi Tazi", 
    rating: 5, 
    comment: "Meilleur barbier de la ville ! Toujours satisfait du résultat.",
    date: "Il y a 3 semaines"
  },
];

export function Reviews() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Témoignages</Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Avis Google</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Ce que disent nos clients satisfaits
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review, i) => (
          <Card key={i} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-yellow-500/10">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`h-5 w-5 ${j < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">{review.rating}.0</span>
              </div>
              <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">{review.date}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">"{review.comment}"</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">– {review.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
