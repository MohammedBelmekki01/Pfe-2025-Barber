import { useState, useEffect } from 'react';

export default function ServiceForm({ onSubmit, initialData = null, isEditing = false, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        duration: initialData.duration,
        image: null,
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded mb-6">
      <input name="name" required placeholder="Nom" value={form.name} onChange={handleChange} className="p-2 border" />
      <input name="price" required type="number" placeholder="Prix" value={form.price} onChange={handleChange} className="p-2 border" />
      <input name="duration" required type="number" placeholder="Durée (minutes)" value={form.duration} onChange={handleChange} className="p-2 border" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-2 border col-span-1 md:col-span-2" />
      <input type="file" name="image" accept="image/*" onChange={handleChange} className="col-span-1 md:col-span-2" />
      <div className="col-span-1 md:col-span-2 flex gap-4">
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">{isEditing ? 'Modifier' : 'Ajouter'}</button>
        {isEditing && (
          <button type="button" onClick={onCancel} className="bg-gray-400 p-2 rounded">Annuler</button>
        )}
      </div>
    </form>
  );
}
