import { useEffect, useRef } from 'react';
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
const userIcon = L.divIcon({
  html: `<div class="relative">
    <div class="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 animate-ping opacity-30"></div>
    <div class="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
  </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const supplierIcon = L.divIcon({
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

export function LocationMap({ userLocation, suppliers, selectedSupplier, onSupplierSelect }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const supplierMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const selectedCircleRef = useRef<L.Circle | null>(null);

  const defaultCenter: [number, number] = [-1.2921, 36.8219]; // Nairobi

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(defaultCenter, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update user location
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old user marker and circle
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (userCircleRef.current) {
      map.removeLayer(userCircleRef.current);
      userCircleRef.current = null;
    }

    if (userLocation) {
      // Add user marker
      const marker = L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center">
            <strong style="color: #3b82f6;">Your Location</strong><br/>
            <span style="font-size: 12px; color: #6b7280;">
              ${userLocation.lat.toFixed(6)}, ${userLocation.lon.toFixed(6)}
            </span>
          </div>
        `);
      userMarkerRef.current = marker;

      // Add 20m radius circle
      const circle = L.circle([userLocation.lat, userLocation.lon], {
        radius: 20,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
      }).addTo(map);
      userCircleRef.current = circle;

      // Pan to user location
      map.setView([userLocation.lat, userLocation.lon], 14);
    }
  }, [userLocation]);

  // Update supplier markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    supplierMarkersRef.current.forEach((marker) => map.removeLayer(marker));
    supplierMarkersRef.current.clear();

    // Add supplier markers
    suppliers.forEach((supplier) => {
      const marker = L.marker([supplier.lat, supplier.lon], { icon: supplierIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center min-w-[150px]">
            <strong style="color: #10b981;">${supplier.name}</strong><br/>
            <span style="font-size: 12px; color: #6b7280;">${supplier.address}</span>
          </div>
        `)
        .on('click', () => onSupplierSelect(supplier));
      
      supplierMarkersRef.current.set(supplier.id, marker);
    });
  }, [suppliers, onSupplierSelect]);

  // Update selected supplier circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old circle
    if (selectedCircleRef.current) {
      map.removeLayer(selectedCircleRef.current);
      selectedCircleRef.current = null;
    }

    if (selectedSupplier) {
      const circle = L.circle([selectedSupplier.lat, selectedSupplier.lon], {
        radius: 20,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(map);
      selectedCircleRef.current = circle;
    }
  }, [selectedSupplier]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-elevated border border-border">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}