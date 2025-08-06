export default function ServiceList({ services, onEdit, onDelete }) {
    return (
        <ul className="space-y-4">
            {services.map(service => (
                <li key={service.id} className="border p-4 rounded flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {service.image && (
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/${service.image}`}
                                alt={service.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                        )}
                        <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm">{service.description}</p>
                            <p className="text-sm text-gray-600">{service.duration} min</p>
                            <p className="font-bold">{service.price} MAD</p>
                            {service.barber && <p className="text-xs italic">Barber: {service.barber.name}</p>}
                        </div>
                    </div>
                    {(onEdit || onDelete) && (
                        <div className="flex gap-2">
                            {onEdit && <button className="bg-yellow-400 px-3 py-1 rounded" onClick={() => onEdit(service)}>Modifier</button>}
                            {onDelete && <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => onDelete(service.id)}>Supprimer</button>}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}
