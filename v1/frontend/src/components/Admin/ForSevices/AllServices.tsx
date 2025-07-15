
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import axiosClient from "@/api/axios"

interface Barber {
  id: number
  firstname: string
  lastname: string
  profile_photo: string
  experience: number
  location: string
}

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  barber: Barber
}

export default function AllServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get("/api/admin/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Failed to fetch services", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Chargement des services...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Tous les services</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{service.name}</h2>
                <span className="text-emerald-600 font-bold">{service.price}€</span>
              </div>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{service.barber.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <img
                  src={service.barber.profile_photo || "/placeholder.svg"}
                  alt="Barber"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm font-medium text-foreground">
                  Barbier: <Link to={`/admin/barber-details?id=${service.barber.id}`} className="text-emerald-600 hover:underline">
                    {service.barber.firstname} {service.barber.lastname}
                  </Link>
                </div>
              </div>
              <Link to="/reservation" className="block mt-4">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md flex justify-center items-center gap-2">
                  <Calendar className="w-4 h-4" /> Réserver
                </button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
