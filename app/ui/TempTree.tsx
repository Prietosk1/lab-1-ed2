import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';

const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

export default function TempTree() {
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
      className="basis-full overflow-auto bg-yellow-500 p-3 md:h-auto md:flex-1 md:basis-0"
    >
      <Tree
        data={orgChart}
        orientation="vertical"
        translate={{
          x: dimensions.width / 2, // centra horizontalmente
          y: dimensions.height / 4, // ajusta vertical según prefieras
        }}
        dimensions={dimensions}
      />
    </div>
  );
}
