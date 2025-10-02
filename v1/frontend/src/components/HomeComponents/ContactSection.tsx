"use client"

import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const contactInfo = {
  email: "admin@gmail.com",
  phone: "222222222",
  address: "123 Barber Street, Votre Ville",
  hours: {
    weekdays: "9h00 - 20h00",
    saturday: "9h00 - 18h00",
    sunday: "10h00 - 16h00"
  },
  mapUrl: "https://www.google.com/maps"
}

const contactImages = [
  {
    src: "/images/contact/storefront.jpeg",
    alt: "Façade du salon",
    className: "col-span-2 row-span-2"
  },
  {
    src: "/images/contact/interior1.jpeg",
    alt: "Vue intérieure du salon",
  },
  {
    src: "/images/contact/waiting-area.jpeg",
    alt: "Espace d'attente",
  },
  {
    src: "/images/contact/parking.jpeg",
    alt: "Parking",
  },
  {
    src: "/images/contact/interior2.jpeg",
    alt: "Deuxième vue intérieure",
  },
]

function ContactSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Contactez-nous
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Des questions ou envie de prendre rendez-vous ? Contactez-nous via l’un de ces moyens.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Email Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Par Email</h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Par Téléphone</h3>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Nous rendre visite</h3>
                <p className="text-gray-600 dark:text-gray-400">{contactInfo.address}</p>
                <a
                  href={contactInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                >
                  Voir sur la carte
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Hours Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Horaires d'ouverture</h3>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Lun-Ven : {contactInfo.hours.weekdays}</p>
                  <p>Sam : {contactInfo.hours.saturday}</p>
                  <p>Dim : {contactInfo.hours.sunday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shop Images Gallery */}
        <div className="mt-16 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Visitez notre salon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Découvrez notre espace moderne et confortable
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
            {contactImages.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative overflow-hidden rounded-2xl",
                  image.className
                )}
              >
                <div className="group aspect-square w-full relative overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-center px-4">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 rounded-2xl overflow-hidden shadow-lg h-[400px] max-w-6xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=..." // Ajoutez ici votre URL Google Maps intégrée
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation du salon"
          />
        </div>
      </div>
    </section>
  )
}

export default ContactSection