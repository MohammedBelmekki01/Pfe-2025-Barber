import { useEffect, useState } from 'react';
import ServiceForm from './ServiceForm';
import ServiceList from './ServiceList';
import axiosClient from '@/api/axios';

export default function ServiceParent() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    const res = await axiosClient.get('/api/barber/services');
    setServices(Array.isArray(res.data.data) ? res.data.data : []); // ✅ safe fallback
    console.log(res.data);
  };
    
    
  useEffect(() => {
    
    fetchServices();
  }, []);

  const handleCreate = async (form) => {
    const data = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        data.append(key, form[key]);
      }
    }
    await axiosClient.post('/api/barber/services', data);
    fetchServices();
  };

  const handleUpdate = async (form) => {
    const data = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        data.append(key, form[key]);
      }
    }
    await axiosClient.post(`/api/barber/services/${editing.id}?_method=PUT`, data);
    setEditing(null);
    fetchServices();
  };

  const handleDelete = async (id) => {
    await axiosClient.delete(`/api/barber/services/${id}`);
    fetchServices();
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.price.toString().includes(search)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mes Services</h1>

      <input
        type="text"
        placeholder="Recherche par nom ou prix"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 mb-6 w-full"
      />

      <ServiceForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
      />

      <ServiceList
        services={filteredServices}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
