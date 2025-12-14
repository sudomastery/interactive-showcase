import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Supplier } from '@/types/auth';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.DivIcon({
  html: `<div class="relative">
    <div class="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-ping opacity-30"></div>
    <div class="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary border-2 border-white shadow-lg"></div>
  </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const supplierIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-accent text-white shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface LocationMapProps {
  userLocation: { lat: number; lon: number } | null;
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSupplierSelect: (supplier: Supplier) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export function LocationMap({ userLocation, suppliers, selectedSupplier, onSupplierSelect }: LocationMapProps) {
  const defaultCenter: [number, number] = [-1.2921, 36.8219]; // Nairobi
  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lon] 
    : defaultCenter;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-elevated border border-border">
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <>
            <MapUpdater center={[userLocation.lat, userLocation.lon]} />
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <strong className="text-primary">Your Location</strong>
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {userLocation.lat.toFixed(6)}, {userLocation.lon.toFixed(6)}
                  </span>
                </div>
              </Popup>
            </Marker>
            
            {/* 20m radius circle around user */}
            <Circle
              center={[userLocation.lat, userLocation.lon]}
              radius={20}
              pathOptions={{
                color: 'hsl(217, 91%, 60%)',
                fillColor: 'hsl(217, 91%, 60%)',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Supplier markers */}
        {suppliers.map((supplier) => (
          <Marker
            key={supplier.id}
            position={[supplier.lat, supplier.lon]}
            icon={supplierIcon}
            eventHandlers={{
              click: () => onSupplierSelect(supplier),
            }}
          >
            <Popup>
              <div className="text-center min-w-[150px]">
                <strong className="text-accent">{supplier.name}</strong>
                <br />
                <span className="text-xs text-muted-foreground">{supplier.address}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected supplier 20m radius */}
        {selectedSupplier && (
          <Circle
            center={[selectedSupplier.lat, selectedSupplier.lon]}
            radius={20}
            pathOptions={{
              color: 'hsl(162, 73%, 46%)',
              fillColor: 'hsl(162, 73%, 46%)',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '5, 5',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
