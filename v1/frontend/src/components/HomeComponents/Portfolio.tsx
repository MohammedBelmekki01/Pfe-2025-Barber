import React from "react";
import { Badge } from "@/components/ui/badge";

const portfolioImages = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1617069380632-22b3b2a8f6b4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop",
];

export function Portfolio() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Portfolio</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Notre Travail</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez quelques-unes de nos réalisations
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioImages.map((image, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">
              <img 
                src={image} 
                alt={`Réalisation ${i + 1}`} 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
