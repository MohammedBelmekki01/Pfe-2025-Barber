"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("tous");

  const categories = [
    { id: "tous", name: "Tous" },
    { id: "coupes", name: "Coupes" },
    { id: "barbes", name: "Barbes" },
    { id: "coiffage", name: "Coiffage" },
  ];

  const galleryItems = [
    {
      id: 1,
      category: "coupes",
      image: "/images/gallery/modern-fade-haircut.jpeg",
      title: "Dégradé Moderne",
      description: "Dégradé net avec texture sur le dessus",
    },
    {
      id: 2,
      category: "barbes",
      image: "/images/gallery/full-beard-trim.jpeg",
      title: "Taille de Barbe",
      description: "Soin professionnel de la barbe",
    },
    {
      id: 3,
      category: "coupes",
      image: "/images/gallery/classic-pompadour.jpeg",
      title: "Pompadour Classique",
      description: "Style élégant intemporel",
    },
    {
      id: 4,
      category: "coiffage",
      image: "/images/gallery/premium-styling.jpeg",
      title: "Coiffage Premium",
      description: "Look moderne texturé",
    },
    {
      id: 5,
      category: "barbes",
      image: "/images/gallery/beard-shaping.jpeg",
      title: "Dessin de Barbe",
      description: "Taille de précision",
    },
    {
      id: 6,
      category: "coupes",
      image: "/images/gallery/textured-crop.jpeg",
      title: "Coupe Texturée",
      description: "Style court contemporain",
    },
    {
      id: 7,
      category: "coiffage",
      image: "/images/gallery/complete-makeover.jpeg",
      title: "Look Complet",
      description: "Transformation cheveux et barbe",
    },
    {
      id: 8,
      category: "barbes",
      image: "/images/gallery/clean-shave.jpeg",
      title: "Rasage Traditionnel",
      description: "Rasage à la serviette chaude",
    },
  ];

  const filteredItems =
    activeCategory === "tous"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* En-tête de la Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Camera className="w-4 h-4 mr-2" />
            Notre Galerie
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos Réalisations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos plus belles créations et inspirez-vous pour votre
            prochaine visite chez nous.
          </p>
        </div>

        {/* Filtres par Catégorie */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-1 bg-background rounded-lg shadow-lg border">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Grille de la Galerie */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-0 shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-white/80 mt-1">Voir les détails</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bouton Voir Plus */}
        {filteredItems.length > 8 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
            >
              Voir plus de réalisations
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}