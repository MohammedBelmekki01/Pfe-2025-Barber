import { useEffect, useState } from 'react';

import axiosClient from '@/api/axios';

export default function BarberServicesForClient() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axiosClient.get('/api/client/services').then(res => setServices(res.data.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {services.map(service => (
        <div key={service?.id} className="border rounded p-4 shadow">
          {service.image && <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/${service.image}`} alt={service.name} className="mb-4 w-full h-40 object-cover rounded" />}
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p>{service.description}</p>
          <p className="text-sm text-gray-600">Durée: {service.duration} minutes</p>
          <p className="font-bold mt-2">{service.price} MAD</p>
          <p className="text-xs italic mt-1">Barber: {service.barber?.firstname}</p>
        </div>
      ))}
    </div>
  );
}
