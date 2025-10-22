'use client';

import { useEffect, useState } from 'react';
import type { DivIcon, Icon } from 'leaflet';

export default function useLeafletIcon() {
  const [icon, setIcon] = useState<DivIcon | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en cliente
    (async () => {
      const L = await import('leaflet');

      const customIcon = new L.DivIcon({
        className: 'custom-marker',
        html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      setIcon(customIcon);
      setIsReady(true);
    })();
  }, []);

  return { icon, isReady };
}
