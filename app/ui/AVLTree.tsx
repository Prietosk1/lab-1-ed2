import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';

const orgChart = {
  name: 'Temperaturas',
  children: [
    {
      name: 'Colombia',
      attributes: { temp: '25°C' },
      children: [
        {
          name: 'Bogotá',
          attributes: { temp: '18°C' },
        },
        {
          name: 'Cartagena',
          attributes: { temp: '30°C' },
        },
      ],
    },
    {
      name: 'México',
      attributes: { temp: '28°C' },
      children: [
        {
          name: 'CDMX',
          attributes: { temp: '21°C' },
        },
        {
          name: 'Cancún',
          attributes: { temp: '29°C' },
          children: [
            {
              name: 'Argentina',
              attributes: { temp: '20°C' },
              children: [
                {
                  name: 'Buenos Aires',
                  attributes: { temp: '19°C' },
                },
              ],
            },
            {
              name: 'Córdoba',
              attributes: { temp: '22°C' },
            },
          ],
        },
      ],
    },
  ],
};

export default function AVLTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Medir contenedor
  useEffect(() => {
    if (!containerRef.current) {
      console.warn('Container ref is null');
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-foreground basis-full overflow-auto rounded p-3 md:h-auto md:flex-1 md:basis-0"
    >
      <Tree
        data={orgChart}
        orientation="vertical"
        translate={{
          x: dimensions.width / 2, // centra horizontalmente
          y: dimensions.height / 4, // ajusta vertical según prefieras
        }}
        dimensions={dimensions}
        collapsible={false}
        zoom={0.8}
        nodeSize={{ x: 100, y: 100 }}
        pathFunc={'straight'}
      />
    </div>
  );
}
