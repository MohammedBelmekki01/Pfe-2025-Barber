"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Pierre Dubois",
      rating: 5,
      comment: "Service exceptionnel ! Antoine a su comprendre exactement ce que je voulais. Je recommande vivement !",
      service: "Coupe + Barbe",
      date: "Il y a 2 jours",
    },
    {
      id: 2,
      name: "Marc Laurent",
      rating: 5,
      comment: "Meilleur barbier de Paris ! Accueil chaleureux et résultat parfait à chaque fois.",
      service: "Rasage Traditionnel",
      date: "Il y a 1 semaine",
    },
    {
      id: 3,
      name: "Thomas Martin",
      rating: 5,
      comment: "Enfin un vrai professionnel ! Marcus a transformé ma barbe, je suis ravi du résultat.",
      service: "Entretien Barbe",
      date: "Il y a 3 jours",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 mb-4">
            <Star className="w-3 h-3 mr-2" />
            Témoignages
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ce que disent nos clients</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            La satisfaction de nos clients est notre priorité. Découvrez leurs expériences avec nos services.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/50 dark:to-blue-950/50 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-8 text-center">
              <Quote className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-6" />

              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 dark:text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-foreground italic mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].comment}"
                </p>
              </div>

              <div className="border-t border-emerald-200 dark:border-emerald-800 pt-6">
                <h4 className="font-semibold text-foreground text-lg">{testimonials[currentTestimonial].name}</h4>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {testimonials[currentTestimonial].service}
                </p>
                <p className="text-muted-foreground text-sm">{testimonials[currentTestimonial].date}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentTestimonial === idx ? "bg-emerald-600 dark:bg-emerald-400" : "bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentTestimonial(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
