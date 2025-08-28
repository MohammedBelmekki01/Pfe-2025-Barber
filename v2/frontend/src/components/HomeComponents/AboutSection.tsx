import * as React from "react"
import { Award, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const barbers = [
  {
    id: 1,
    name: "Antoine Dubois",
    title: "Maître Barbier & Fondateur",
    experience: "8 ans",
    specialty: "Coupes classiques & modernes",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Passionné par l'art du barbier depuis plus de 8 ans, Antoine a fondé Barber Pro avec la vision de créer un espace où tradition et modernité se rencontrent.",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Expert en Styling",
    experience: "12 ans",
    specialty: "Barbes & Moustaches",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Spécialiste reconnu dans l'entretien de la barbe, Marcus apporte son expertise internationale acquise dans les plus grands salons européens.",
  },
  {
    id: 3,
    name: "Jean Martin",
    title: "Barbier Traditionnel",
    experience: "15 ans",
    specialty: "Rasage au rasoir",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Gardien des techniques traditionnelles, Jean perpétue l'art ancestral du rasage au rasoir avec une précision et un savoir-faire inégalés.",
  },
    {
    id: 3,
    name: "Jean Martin",
    title: "Barbier Traditionnel",
    experience: "15 ans",
    specialty: "Rasage au rasoir",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Gardien des techniques traditionnelles, Jean perpétue l'art ancestral du rasage au rasoir avec une précision et un savoir-faire inégalés.",
  },
    {
    id: 3,
    name: "Jean Martin",
    title: "Barbier Traditionnel",
    experience: "15 ans",
    specialty: "Rasage au rasoir",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Gardien des techniques traditionnelles, Jean perpétue l'art ancestral du rasage au rasoir avec une précision et un savoir-faire inégalés.",
  },
    {
    id: 3,
    name: "Jean Martin",
    title: "Barbier Traditionnel",
    experience: "15 ans",
    specialty: "Rasage au rasoir",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Gardien des techniques traditionnelles, Jean perpétue l'art ancestral du rasage au rasoir avec une précision et un savoir-faire inégalés.",
  },
]

export function BarberCarousel() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Nos Barbiers</h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-4">
          {barbers.map((barber) => (
            <CarouselItem
              key={barber.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-emerald-200"
                    />
                    <h3 className="text-lg font-semibold">{barber.name}</h3>
                    <p className="text-emerald-600 text-sm">{barber.title}</p>
                    <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{barber.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{barber.specialty}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {barber.description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
