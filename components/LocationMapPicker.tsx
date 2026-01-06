import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { offlineMapService } from '../utils/offlineMapService';
import { RESTAURANT_COORDS } from '../utils/distance';

// Fix for default marker icon in React Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle tile loading from offline cache
const OfflineTileLayer = () => {
  const map = useMap();

  useEffect(() => {
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    });

    // Override the createTile method to use our offline cache
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tileLayer as any).createTile = function (coords: any, done: any) {
      const tile = document.createElement('img');
      const url = this.getTileUrl(coords);

      tile.onload = function () {
        done(undefined, tile);
      };

      tile.onerror = function () {
        // If online loading fails, try offline cache
        offlineMapService.getTile(coords.x, coords.y, coords.z).then((blob) => {
          if (blob) {
            const objectUrl = URL.createObjectURL(blob);
            tile.src = objectUrl;
            // Clean up object URL after load to prevent leaks
            tile.onload = () => {
              URL.revokeObjectURL(objectUrl);
              done(undefined, tile);
            };
          } else {
            done(new Error('Tile not found in cache'), tile);
          }
        });
      };

      tile.src = url;
      return tile;
    };

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map]);

  return null;
};

// Component to handle map clicks and marker dragging
const LocationMarker = ({
  position,
  onPositionChange,
  isInteractive,
}: {
  position: { lat: number; lng: number };
  onPositionChange: (lat: number, lng: number) => void;
  isInteractive: boolean;
}) => {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState(position);

  // We rely on the parent key prop to reset this component when external location changes

  const eventHandlers = React.useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dragend(e: any) {
        const marker = e.target;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          setMarkerPos({ lat, lng });
          onPositionChange(lat, lng);
        }
      },
    }),
    [onPositionChange]
  );

  useEffect(() => {
    // Only fly on mount or dramatic shift, avoiding loops
    map.flyTo([position.lat, position.lng], map.getZoom());
  }, [map, position.lat, position.lng]);

  return (
    <Marker
      draggable={isInteractive}
      eventHandlers={eventHandlers}
      position={[markerPos.lat, markerPos.lng]}
      ref={(ref) => {
        if (ref) {
          // Open popup immediately
          // ref.openPopup();
        }
      }}
    >
      <Popup>{isInteractive ? 'Drag me to adjust!' : 'You are here'}</Popup>
    </Marker>
  );
};

// Component to draw a line between user and restaurant
const ConnectionLine = ({ userPos }: { userPos: { lat: number; lng: number } }) => {
  const positions = [
    [userPos.lat, userPos.lng],
    [RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng],
  ] as [number, number][];

  return (
    <Polyline positions={positions} color="#3b82f6" weight={3} dashArray="10, 10" opacity={0.7} />
  );
};

// Component to fit map bounds to show both markers
const MapBoundsFitter = ({ userPos }: { userPos: { lat: number; lng: number } }) => {
  const map = useMap();

  useEffect(() => {
    // Determine bounds containing both points
    const bounds = L.latLngBounds(
      [userPos.lat, userPos.lng],
      [RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng]
    );
    // Fit bounds with padding so markers aren't on the edge
    map.fitBounds(bounds, { padding: [80, 80] });
  }, [map]); // Run once on mount (since key prop resets component)

  return null;
};

// Restaurant Marker
const RestaurantMarker = () => {
  const customIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Marker position={[RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng]} icon={customIcon}>
      <Popup>
        <strong>Snip Taste</strong>
        <br />
        Restaurant
      </Popup>
    </Marker>
  );
};

interface LocationMapPickerProps {
  initialLat: number;
  initialLng: number;
  onConfirm: (lat: number, lng: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  initialLat,
  initialLng,
  onConfirm,
  onClose,
  isOpen,
}) => {
  // Initialize state once. Parent key prop handles resets.
  const [currentPos, setCurrentPos] = useState({ lat: initialLat, lng: initialLng });
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-white border-b flex justify-between items-center z-10">
          <div>
            <h3 className="font-bold text-lg text-gray-800">📍 Confirm Your Location</h3>
            <p className="text-xs text-gray-500">
              Drag the marker to your exact location
              {isOffline && <span className="ml-2 text-orange-500 font-bold">(Offline Mode)</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close Map"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gray-100">
          <MapContainer
            center={[initialLat, initialLng]}
            zoom={13} // Starts zoomed out a bit, but BoundsFitter will fix it
            style={{ height: '100%', width: '100%' }}
          >
            <OfflineTileLayer />

            {/* Auto-fit bounds on load */}
            <MapBoundsFitter userPos={currentPos} />

            {/* Connection Line */}
            <ConnectionLine userPos={currentPos} />

            {/* User Draggable Marker */}
            <LocationMarker
              position={currentPos}
              onPositionChange={(lat, lng) => setCurrentPos({ lat, lng })}
              isInteractive={true}
            />

            {/* Restaurant Fixed Marker */}
            <RestaurantMarker />
          </MapContainer>

          {/* Centering crosshair (visual aid) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] opacity-50">
            <svg
              className="w-8 h-8 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 3v18M3 12h18"
              />
            </svg>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-white border-t flex flex-col gap-3 z-10">
          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 flex items-start gap-2">
            <span>💡</span>
            <p>Moving the pin improves delivery accuracy. The dashed line shows the direct path.</p>
          </div>

          <button
            onClick={() => onConfirm(currentPos.lat, currentPos.lng)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};
