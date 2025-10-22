'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import useLeafletIcon from '../hooks/useLeafletIcon';

// ⛔️ Importamos react-leaflet *dinámicamente* para evitar SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), {
  ssr: false,
});

export default function MapView() {
  const { icon, isReady } = useLeafletIcon();

  if (!isReady || !icon) {
    return (
      <div className="flex h-full items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex-1">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        className="z-0 h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[20, 0]} icon={icon}>
          <Popup>Hola desde el mapa 🌎</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
