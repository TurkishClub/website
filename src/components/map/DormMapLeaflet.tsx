'use client';

import {useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';
import {useTranslations} from 'next-intl';
import dynamic from 'next/dynamic';
import {MapPin, Navigation} from 'lucide-react';
import {pillClass} from '@/components/home/Pill';
import {Dorm} from '@/data/dorms';
import L from 'leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in SSR
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  {ssr: false}
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  {ssr: false}
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  {ssr: false}
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  {ssr: false}
);

const defaultIcon = new L.Icon.Default();

// The selected dorm gets a cardinal pin.
const selectedIcon = L.divIcon({
  className: '',
  html: '<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 27 15 27s15-15.8 15-27C30 6.7 23.3 0 15 0z" fill="#8b1a1a"/><circle cx="15" cy="15" r="5.5" fill="#fff"/></svg>',
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

/** Pans and zooms to the selected dorm whenever it changes. */
function FocusSelected({dorm}: {dorm?: Dorm | null}) {
  const map = useMap();
  useEffect(() => {
    if (!dorm) return;
    map.flyTo([dorm.coordinates.lat, dorm.coordinates.lng], Math.max(map.getZoom(), 14), {duration: 0.6});
  }, [dorm, map]);
  return null;
}

interface DormMapProps {
  dorms: Dorm[];
  selectedDorm?: Dorm | null;
  onDormSelect?: (dorm: Dorm) => void;
}

export function DormMapLeaflet({
  dorms,
  selectedDorm,
  onDormSelect
}: DormMapProps) {
  const t = useTranslations('dormSearch');
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before rendering the map
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDormClick = (dorm: Dorm) => {
    if (onDormSelect) {
      onDormSelect(dorm);
    }
  };

  const openInGoogleMaps = (dorm: Dorm) => {
    if (typeof window !== 'undefined') {
      const query = encodeURIComponent(dorm.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const openAllInGoogleMaps = () => {
    if (typeof window !== 'undefined') {
      const munichCenter = '48.1351,11.5820';
      const url = `https://www.google.com/maps/search/student+dormitory+München/@${munichCenter},12z`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't render the map on the server
  if (!isMounted) {
    return (
      <div className="flex flex-col overflow-hidden bg-white">
        <div className="border-b border-ink-950/15 p-5">
          <h3 className="font-serif text-2xl font-normal">
            {t('map.title')}
          </h3>
          <p className="mt-1 text-sm text-ink-500">{t('map.loading')}</p>
        </div>
        <div className="flex h-[360px] items-center justify-center bg-stone-200">
          <div className="text-ink-500">{t('map.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-950/15 p-5">
        <div>
          <h3 className="font-serif text-2xl font-normal">
            {t('map.title')}
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            {t('map.showingLocations', {count: String(dorms.length)})}
          </p>
        </div>
        <button type="button" onClick={openAllInGoogleMaps} className={pillClass('outline', 'whitespace-nowrap px-5 py-2.5')}>
          Google Maps&apos;te Aç
          <span aria-hidden>↗</span>
        </button>
      </div>

      <div className="relative h-[60svh] min-h-[360px] md:h-[560px]">
        <MapContainer
          center={[48.1351, 11.582]} // Munich center
          zoom={11}
          style={{height: '100%', width: '100%'}}
          className="z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <FocusSelected dorm={selectedDorm} />

          {dorms.map((dorm) => (
            <Marker
              key={dorm.id}
              position={[dorm.coordinates.lat, dorm.coordinates.lng]}
              icon={selectedDorm?.id === dorm.id ? selectedIcon : defaultIcon}
              zIndexOffset={selectedDorm?.id === dorm.id ? 1000 : 0}
              eventHandlers={{
                click: () => handleDormClick(dorm)
              }}
            />
          ))}
        </MapContainer>
      </div>

      {selectedDorm && (
        <div className="flex flex-col gap-4 border-t border-ink-950/15 p-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-serif text-2xl leading-tight">{selectedDorm.name}</p>
              <p className="mt-1 font-serif text-xl text-cardinal-700">
                {selectedDorm.rent.type === 'range'
                  ? `€${selectedDorm.rent.minPrice} - €${selectedDorm.rent.maxPrice}`
                  : `€${selectedDorm.rent.singlePrice}`}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-700">
                <MapPin aria-hidden className="h-4 w-4 text-ink-500" />
                {selectedDorm.address}
              </p>
            </div>

              <div className="flex flex-wrap gap-2">
                {selectedDorm.website && (
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        selectedDorm.website,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    className={pillClass('ink', 'px-5 py-2.5')}
                  >
                    {t('map.popup.visitWebsite')}
                    <span aria-hidden>↗</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openInGoogleMaps(selectedDorm)}
                  className={pillClass('outline', 'px-5 py-2.5')}
                >
                  <Navigation aria-hidden className="h-4 w-4" />
                  {t('map.popup.getDirections')}
                </button>
              </div>
        </div>
      )}

      <div className="border-t border-ink-950/15 bg-stone-50 px-5 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
              <span className="text-ink-700">Öğrenci Yurdu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cardinal-700"></div>
              <span className="text-ink-700">Seçili Yurt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
