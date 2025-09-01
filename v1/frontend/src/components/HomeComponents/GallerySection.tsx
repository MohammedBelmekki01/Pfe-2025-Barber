"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tous" },
    { id: "haircuts", name: "Coupes" },
    { id: "beards", name: "Barbes" },
    { id: "styling", name: "Styling" },
  ];

  const galleryItems = [
    {
      id: 1,
      category: "haircuts",
      image: "/placeholder.svg?height=400&width=400",
      title: "Coupe Moderne",
    },
    {
      id: 2,
      category: "beards",
      image: "/placeholder.svg?height=400&width=400",
      title: "Barbe Sculptée",
    },
    {
      id: 3,
      category: "haircuts",
      image: "/placeholder.svg?height=400&width=400",
      title: "Coupe Classique",
    },
    {
      id: 4,
      category: "styling",
      image: "/placeholder.svg?height=400&width=400",
      title: "Styling Premium",
    },
    {
      id: 5,
      category: "beards",
      image: "/placeholder.svg?height=400&width=400",
      title: "Rasage Traditionnel",
    },
    {
      id: 6,
      category: "haircuts",
      image: "/placeholder.svg?height=400&width=400",
      title: "Coupe Tendance",
    },
    {
      id: 7,
      category: "styling",
      image: "/placeholder.svg?height=400&width=400",
      title: "Look Complet",
    },
    {
      id: 8,
      category: "beards",
      image: "/placeholder.svg?height=400&width=400",
      title: "Entretien Barbe",
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Camera className="w-4 h-4 mr-2" />
            Notre Portfolio
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos Réalisations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez quelques-unes de nos plus belles créations et laissez-vous
            inspirer pour votre prochain look.
          </p>
        </div>

        {/* Category Filter */}
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

        {/* Gallery Grid */}
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
                    <p className="text-sm text-white/80 mt-1">Voir le détail</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Show more button if needed */}
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