import { Calendar, Star, Users, Award, Scissors, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Modern background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.03)_50%,transparent_75%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.08)_50%,transparent_75%)]"></div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400 dark:bg-purple-500 rounded-full animate-bounce"></div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 backdrop-blur-sm dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                <Scissors className="w-3 h-3 mr-2" />
                Depuis 2015 • Expert Certifié
              </Badge>

              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black tracking-tight">
                  <span className="block text-gray-900 dark:text-white">BARBER</span>
                  <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 dark:from-emerald-300 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                    PRO
                  </span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 dark:from-emerald-300 dark:to-blue-300 rounded-full"></div>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Redéfinissez votre style avec l'expertise d'un barbier moderne.
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {" "}
                  Précision, élégance et tradition
                </span>
                se rencontrent pour révéler le meilleur de vous-même.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 dark:hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
              >
                <Calendar className="mr-3 h-5 w-5" />
                Réserver Maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white px-8 py-6 text-lg backdrop-blur-sm transition-all duration-300 bg-transparent"
              >
                Découvrir nos Services
              </Button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm">Paris 11ème</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm">01 23 45 67 89</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Clients Fidèles</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">8+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ans d'Excellence</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all duration-300 group col-span-2">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 dark:text-yellow-300 fill-current" />
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4.9/5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Note Google • 127 avis</div>
                </CardContent>
              </Card>
            </div>

            {/* Feature highlight */}
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-800 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Coupe Signature</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Technique exclusive développée par nos maîtres barbiers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 dark:from-gray-900/50 to-transparent"></div>
    </section>
  )
}
