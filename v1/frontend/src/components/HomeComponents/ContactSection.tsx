import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Mail, Calendar } from "lucide-react"

export function ContactSection() {
  const locations = [
    {
      id: 1,
      name: "Barber Pro République",
      address: "123 Avenue de la République, 75011 Paris",
      phone: "01 23 45 67 89",
      email: "republique@barberpro.fr",
      hours: {
        weekdays: "9h00 - 19h00",
        saturday: "9h00 - 18h00",
        sunday: "Fermé",
      },
    },
    {
      id: 2,
      name: "Barber Pro Bastille",
      address: "456 Rue de la Bastille, 75011 Paris",
      phone: "01 23 45 67 90",
      email: "bastille@barberpro.fr",
      hours: {
        weekdays: "10h00 - 20h00",
        saturday: "9h00 - 19h00",
        sunday: "10h00 - 16h00",
      },
    },
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 mb-4">
            <MapPin className="w-3 h-3 mr-2" />
            Nous Contacter
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Nos Salons</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Retrouvez-nous dans nos deux salons parisiens. Réservation en ligne ou par téléphone.
          </p>
        </div>

        {/* Locations */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {locations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow bg-card border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">{location.name}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{location.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-muted-foreground">{location.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-muted-foreground">{location.email}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-card-foreground">Horaires</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Lun - Ven</span>
                      <span>{location.hours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samedi</span>
                      <span>{location.hours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche</span>
                      <span>{location.hours.sunday}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Réserver dans ce salon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-700 dark:to-blue-700 text-white max-w-2xl mx-auto border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Prêt pour un nouveau look ?</h3>
              <p className="mb-6 opacity-90">
                Réservez dès maintenant votre rendez-vous et découvrez l'excellence de nos services.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-emerald-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-emerald-700 dark:hover:bg-gray-200"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Réserver Maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
