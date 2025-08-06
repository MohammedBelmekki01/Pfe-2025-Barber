
// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Clock, MapPin, Calendar } from "lucide-react"
// import { Link } from "react-router-dom"
// import axiosClientClient from "@/api/axiosClient"

// interface Barber {
//   id: number
//   firstname: string
//   lastname: string
//   profile_photo: string
//   experience: number
//   location: string
// }

// interface Service {
//   id: number
//   name: string
//   description: string
//   price: number
//   duration: number
//   barber: Barber
// }

// export default function AllServicesPage() {
//   const [services, setServices] = useState<Service[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     axiosClientClient
//       .get("/api/admin/services")
//       .then((res) => setServices(res.data))
//       .catch((err) => console.error("Failed to fetch services", err))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) {
//     return (
//       <div className="container mx-auto py-12 px-4">
//         <h1 className="text-3xl font-bold mb-8">Chargement des services...</h1>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold mb-8">Tous les services</h1>
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {services.map((service) => (
//           <Card key={service.id} className="hover:shadow-lg transition">
//             <CardContent className="p-6 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-semibold text-foreground">{service.name}</h2>
//                 <span className="text-emerald-600 font-bold">{service.price}€</span>
//               </div>
//               <p className="text-sm text-muted-foreground">{service.description}</p>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Clock className="w-4 h-4" />
//                 <span>{service.duration} min</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <MapPin className="w-4 h-4" />
//                 <span>{service.barber.location}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <img
//                   src={service.barber.profile_photo || "/placeholder.svg"}
//                   alt="Barber"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <div className="text-sm font-medium text-foreground">
//                   Barbier: <Link to={`/admin/barber-details?id=${service.barber.id}`} className="text-emerald-600 hover:underline">
//                     {service.barber.firstname} {service.barber.lastname}
//                   </Link>
//                 </div>
//               </div>
//               <Link to="/reservation" className="block mt-4">
//                 <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md flex justify-center items-center gap-2">
//                   <Calendar className="w-4 h-4" /> Réserver
//                 </button>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
import axiosClient from '@/api/axios';
import { useEffect, useState } from 'react';



export default function AllServices() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [barberFilter, setBarberFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBarbers = async () => {
    try {
      const res = await axiosClient.get('/api/admin/barbers');
      setBarbers(Array.isArray(res.data.data) ? res.data.data : []); // Sécurité .data
    } catch (error) {
      console.error('Erreur chargement barbers:', error);
      setBarbers([]);
    }
  };

const fetchServices = async () => {
  setLoading(true);
  try {
    const params: any = {};
    if (barberFilter) params.barber_id = barberFilter;
    if (search) params.search = search;

    const res = await axiosClient.get('/api/admin/services', { params });

    // ✅ Correction ici : accéder à data.data
    const serviceList = Array.isArray(res.data.data) ? res.data.data : [];
    setServices(serviceList);
  } catch (error) {
    console.error('Erreur chargement services:', error);
    setServices([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBarbers();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [barberFilter, search]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tous les Services</h1>

      <div className="flex items-center gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={barberFilter}
          onChange={e => setBarberFilter(e.target.value)}
        >
          <option value="">Tous les Barbers</option>
          {Array.isArray(barbers) && barbers.map(barber => (
            <option key={barber.id} value={barber.id}>
              {barber.firstname} {barber.lastname}
            </option>

          ))}
        </select>

        <input
          type="text"
          placeholder="Rechercher par nom ou prix..."
          className="border p-2 rounded flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Chargement des services...</p>
      ) : (
        <ul className="space-y-4">
          {services.map(service => (
            <li key={service.id} className="border p-4 rounded flex gap-4 items-center">
              {service.image && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/storage/${service.image}`}
                  alt={service.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p>{service.description}</p>
                <p className="text-sm text-gray-600">{service.duration} min</p>
                <p className="font-bold">{service.price} MAD</p>
                <p className="text-xs italic">Barber: {service.barber?.firstname|| 'N/A'} {service.barber?.lastname}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
