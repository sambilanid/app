/**
 * Komponen MiniMapPreview.
 * Tujuan: Menampilkan peta statis/interaktif mini menggunakan Leaflet 
 * yang memvisualisasikan pinpoint lokasi (tunggal) atau rute pengantaran (awal & tujuan).
 * Digunakan saat: Menampilkan pratinjau peta di halaman QuestDetailPage dan ManageQuestPage.
 */
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import mapPreview from '../../assets/map-preview.png';

interface MiniMapPreviewProps {
  coords?: { lat: number; lng: number };
  fromCoords?: { lat: number; lng: number };
  toCoords?: { lat: number; lng: number };
}

export const MiniMapPreview: React.FC<MiniMapPreviewProps> = ({ coords, fromCoords, toCoords }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeCoords = coords || fromCoords || toCoords;

  useEffect(() => {
    if (!activeCoords || !containerRef.current) return;

    // Custom DivIcon for Leaflet MapPin
    const pinIcon = L.divIcon({
      html: `
        <div class="text-[#00694b] filter drop-shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" class="lucide lucide-map-pin">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3" fill="white"/>
          </svg>
        </div>
      `,
      className: 'mini-map-pin',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true, // Allow user to slightly pan map
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    if (fromCoords && toCoords) {
      const fromIcon = L.divIcon({
        html: `
          <div class="text-orange-500 filter drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
          </div>
        `,
        className: 'mini-map-pin-from',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const toIcon = L.divIcon({
        html: `
          <div class="text-[#00694b] filter drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
          </div>
        `,
        className: 'mini-map-pin-to',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const markerFrom = L.marker([fromCoords.lat, fromCoords.lng], { icon: fromIcon }).addTo(map);
      const markerTo = L.marker([toCoords.lat, toCoords.lng], { icon: toIcon }).addTo(map);

      // Dashline connecting from & to
      const polyline = L.polyline(
        [[fromCoords.lat, fromCoords.lng], [toCoords.lat, toCoords.lng]],
        { color: '#00694b', dashArray: '5, 8', weight: 3, opacity: 0.8 }
      ).addTo(map);

      const group = L.featureGroup([markerFrom, markerTo, polyline]);
      map.fitBounds(group.getBounds().pad(0.35));
    } else {
      L.marker([activeCoords.lat, activeCoords.lng], { icon: pinIcon }).addTo(map);
      map.setView([activeCoords.lat, activeCoords.lng], 15);
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
    };
  }, [activeCoords, fromCoords, toCoords]);

  if (!activeCoords) {
    return (
      <div className="bg-[#e0e9f2] border border-[#bdcac1] h-32 rounded-2xl overflow-hidden relative">
         <img 
           src={mapPreview} 
           alt="map" 
           className="w-full h-full object-cover opacity-60"
         />
         <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={32} className="text-primary animate-bounce" />
         </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="border border-[#bdcac1] h-36 rounded-2xl overflow-hidden relative z-0"
    />
  );
};
