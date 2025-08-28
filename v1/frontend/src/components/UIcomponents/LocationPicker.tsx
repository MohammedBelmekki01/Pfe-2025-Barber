import { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 31.7917, // Morocco center
  lng: -7.0926,
};

interface LocationPickerProps {
  onSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPicker({
  onSelect,
  initialLat,
  initialLng,
}: LocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const [search, setSearch] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);

  // Center map on initial coordinates
  useEffect(() => {
    if (initialLat && initialLng && mapRef.current) {
      mapRef.current.panTo({ lat: initialLat, lng: initialLng });
      mapRef.current.setZoom(14);
    }
  }, [initialLat, initialLng, isLoaded]);

  // Autocomplete predictions
  useEffect(() => {
    if (!isLoaded || !search) {
      setAutocompleteResults([]);
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: search, componentRestrictions: { country: "ma" } },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setAutocompleteResults(predictions);
        } else {
          setAutocompleteResults([]);
        }
      }
    );
  }, [search, isLoaded]);

  // Select autocomplete result
  const handleResultClick = (placeId: string) => {
    if (!isLoaded) return;

    const service = new google.maps.places.PlacesService(
      mapRef.current || dummyDivRef.current!
    );

    service.getDetails(
      { placeId, fields: ["geometry"] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMarker({ lat, lng });
          onSelect(lat, lng);

          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(14);
          }

          setSearch("");
          setAutocompleteResults([]);
        }
      }
    );
  };

  // Map click
  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      onSelect(lat, lng);
      setSearch("");
      setAutocompleteResults([]);
    },
    [onSelect]
  );

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search location..."
          className="w-full p-2 border rounded-lg"
          autoComplete="off"
        />
        {autocompleteResults.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow mt-1 max-h-48 overflow-auto">
            {autocompleteResults.map((result) => (
              <li
                key={result.place_id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleResultClick(result.place_id)}
              >
                {result.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 14 : 5}
        onLoad={(map) => (mapRef.current = map)}
        onClick={handleClick}
      >
        {marker && <Marker position={{ lat: marker.lat, lng: marker.lng }} />}
      </GoogleMap>

      {/* Dummy div for fallback */}
      <div ref={dummyDivRef} style={{ display: "none" }} />

      {marker && (
        <div className="text-xs text-muted-foreground mt-2">
          Latitude: {marker.lat}, Longitude: {marker.lng}
        </div>
      )}
    </div>
  );
}
