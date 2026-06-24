/**
 * Komponen MapPinpointModal.
 * Tujuan: Menyediakan antarmuka peta interaktif menggunakan Leaflet dan OpenStreetMap 
 * untuk menetapkan titik lokasi (pinpoint) beserta koordinatnya pada quest.
 * Digunakan saat: Pengguna menekan tombol "Pinpoint Peta" pada form pembuatan quest.
 */
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, MapPin, X, Navigation, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface MapPinpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialLocationName?: string;
  initialCoords?: { lat: number; lng: number };
  onConfirm: (locationName: string, coords: { lat: number; lng: number }) => void;
}

const BANDUNG_COORDS = { lat: -6.9175, lng: 107.6191 };

export const MapPinpointModal: React.FC<MapPinpointModalProps> = ({
  isOpen,
  onClose,
  title,
  initialLocationName = '',
  initialCoords,
  onConfirm,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const centerMarker = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialLocationName);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>(BANDUNG_COORDS);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Quick select presets for Bandung/Jakarta area to prevent blank state / offline issues
  const presetLocations = [
    { name: 'Gedung Sate, Bandung', lat: -6.9025, lng: 107.6188 },
    { name: 'Bandung Indah Plaza (BIP)', lat: -6.9083, lng: 107.6108 },
    { name: 'Stasiun Bandung', lat: -6.9142, lng: 107.6023 },
    { name: 'Institut Teknologi Bandung (ITB)', lat: -6.8915, lng: 107.6107 },
    { name: 'Alun-Alun Bandung', lat: -6.9219, lng: 107.6069 },
    { name: 'Grand Indonesia, Jakarta', lat: -6.1953, lng: 106.8202 },
  ];

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    const startCoords = initialCoords || BANDUNG_COORDS;
    const startAddress = initialLocationName || '';

    setSelectedCoords(startCoords);
    setSelectedAddress(startAddress);

    // Standard Leaflet Pin DivIcon to avoid Vite asset bugs
    const pinIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -top-10 flex flex-col items-center">
            <div class="bg-[#00694b] text-white text-xs py-1 px-2 rounded-lg shadow-md font-bold whitespace-nowrap mb-1 border border-white">
              Geser Peta ke Lokasi
            </div>
            <div class="text-[#00694b] filter drop-shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" class="lucide lucide-map-pin">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      `,
      className: 'custom-map-pin',
      iconSize: [38, 38],
      iconAnchor: [19, 0],
    });

    // Create Leaflet Map Instance
    const initialLat = startCoords.lat;
    const initialLng = startCoords.lng;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([initialLat, initialLng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add Zoom Control at custom position
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Create a static marker in the center that doesn't drag, map drags under it
    const marker = L.marker(map.getCenter(), { icon: pinIcon }).addTo(map);
    centerMarker.current = marker;
    mapInstance.current = map;

    // Helper function to fetch reverse geocode address
    const reverseGeocode = async (lat: number, lng: number) => {
      setIsReverseGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
              'User-Agent': 'Sambilan-App-Demo/1.0',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.display_name) {
            // Simplify address representation
            const addressParts = data.display_name.split(',');
            const shortAddress = addressParts.slice(0, 3).join(',').trim();
            setSelectedAddress(shortAddress || data.display_name);
          }
        }
      } catch (err) {
        console.error('Failed reverse geocoding:', err);
      } finally {
        setIsReverseGeocoding(false);
      }
    };

    // Update marker and coordinate on map drag
    map.on('move', () => {
      const center = map.getCenter();
      marker.setLatLng(center);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      const newCoords = { lat: center.lat, lng: center.lng };
      setSelectedCoords(newCoords);
      reverseGeocode(center.lat, center.lng);
    });

    // Run initial reverse geocode if no address set
    if (!initialLocationName) {
      reverseGeocode(initialLat, initialLng);
    }

    // Trigger map resize check
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=id&limit=5`,
        {
          headers: {
            'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
            'User-Agent': 'Sambilan-App-Demo/1.0',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const coords = { lat, lng };

    setSelectedCoords(coords);
    
    const addressParts = result.display_name.split(',');
    const shortAddress = addressParts.slice(0, 3).join(',').trim();
    setSelectedAddress(shortAddress || result.display_name);

    if (mapInstance.current) {
      mapInstance.current.setView([lat, lng], 16);
    }

    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSelectPreset = (preset: typeof presetLocations[0]) => {
    const coords = { lat: preset.lat, lng: preset.lng };
    setSelectedCoords(coords);
    setSelectedAddress(preset.name);

    if (mapInstance.current) {
      mapInstance.current.setView([preset.lat, preset.lng], 16);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedAddress, selectedCoords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-screen-md h-[92vh] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
          <div>
            <h3 className="font-bold text-dark text-lg">{title}</h3>
            <p className="text-xs text-gray-500">Tentukan titik kordinat tepat quest Anda</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar Panel */}
        <div className="p-4 bg-white border-b border-gray-100 z-10 shrink-0 flex flex-col gap-2 relative">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="bg-gray-50 border border-[#bdcac1] flex gap-3 h-12 items-center px-4 rounded-xl flex-1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari lokasi (contoh: Paskal 23, Gedung Sate)"
                className="flex-1 text-sm text-dark outline-none bg-transparent placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button type="submit" size="md" className="h-12 shrink-0">
              {isSearching ? <Loader2 size={18} className="animate-spin text-white" /> : 'Cari'}
            </Button>
          </form>

          {/* Autocomplete Search Results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-16 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 z-20 max-h-60 overflow-y-auto divide-y divide-gray-100">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectResult(result)}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex gap-3 items-start"
                >
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-dark">
                      {result.display_name.split(',')[0]}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-md">
                      {result.display_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preset Buttons for Quick Select */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {presetLocations.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="bg-gray-100 hover:bg-gray-200 text-dark text-xs px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors border border-gray-200"
              >
                {preset.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
          
          {/* Geolocation Button */}
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation && mapInstance.current) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setSelectedCoords({ lat, lng });
                    mapInstance.current?.setView([lat, lng], 16);
                  },
                  () => {
                    alert('Gagal mendapatkan lokasi saat ini. Pastikan izin lokasi aktif.');
                  }
                );
              }
            }}
            className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-dark hover:text-primary z-10 transition-colors"
          >
            <Navigation size={20} />
          </button>
        </div>

        {/* Bottom Details Panel */}
        <div className="p-5 bg-white border-t border-gray-100 z-10 shrink-0 flex flex-col gap-4">
          <div className="flex gap-3 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <MapPin size={24} className="text-primary shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Lokasi Terpilih</span>
              <p className="text-sm font-semibold text-dark truncate">
                {isReverseGeocoding ? 'Mengidentifikasi lokasi...' : selectedAddress || 'Lokasi belum ditentukan'}
              </p>
              <p className="text-[10px] text-gray-400 font-mono">
                Coords: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleConfirm} className="flex-1" disabled={isReverseGeocoding}>
              Konfirmasi Lokasi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
