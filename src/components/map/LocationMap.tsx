import { useEffect } from 'react';
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
    <div class="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 animate-ping opacity-30"></div>
    <div class="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
  </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const supplierIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-emerald-500 text-white shadow-lg">
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

function UserMarker({ userLocation }: { userLocation: { lat: number; lon: number } }) {
  return (
    <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <strong style={{ color: '#3b82f6' }}>Your Location</strong>
          <br />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {userLocation.lat.toFixed(6)}, {userLocation.lon.toFixed(6)}
          </span>
        </div>
      </Popup>
    </Marker>
  );
}

function UserCircle({ userLocation }: { userLocation: { lat: number; lon: number } }) {
  return (
    <Circle
      center={[userLocation.lat, userLocation.lon]}
      radius={20}
      pathOptions={{
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
      }}
    />
  );
}

function SupplierMarker({ 
  supplier, 
  onSelect 
}: { 
  supplier: Supplier; 
  onSelect: (supplier: Supplier) => void;
}) {
  return (
    <Marker
      position={[supplier.lat, supplier.lon]}
      icon={supplierIcon}
      eventHandlers={{
        click: () => onSelect(supplier),
      }}
    >
      <Popup>
        <div className="text-center min-w-[150px]">
          <strong style={{ color: '#10b981' }}>{supplier.name}</strong>
          <br />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>{supplier.address}</span>
        </div>
      </Popup>
    </Marker>
  );
}

function SelectedSupplierCircle({ supplier }: { supplier: Supplier }) {
  return (
    <Circle
      center={[supplier.lat, supplier.lon]}
      radius={20}
      pathOptions={{
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5',
      }}
    />
  );
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
        
        {userLocation ? <MapUpdater center={[userLocation.lat, userLocation.lon]} /> : null}
        {userLocation ? <UserMarker userLocation={userLocation} /> : null}
        {userLocation ? <UserCircle userLocation={userLocation} /> : null}

        {suppliers.map((supplier) => (
          <SupplierMarker 
            key={supplier.id} 
            supplier={supplier} 
            onSelect={onSupplierSelect} 
          />
        ))}

        {selectedSupplier ? <SelectedSupplierCircle supplier={selectedSupplier} /> : null}
      </MapContainer>
    </div>
  );
}
