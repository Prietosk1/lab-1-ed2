import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// -------------------- Rutas --------------------
const csvFilePath = path.resolve(
  process.cwd(),
  'app',
  'data',
  'flights_final.csv'
);
const outputDir = path.resolve(process.cwd(), 'app', 'data', 'json');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// -------------------- Función para leer CSV --------------------
const readCSV = (): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const file = fs.readFileSync(csvFilePath, 'utf8');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });

// -------------------- Función para calcular distancia entre coordenadas --------------------
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// -------------------- Procesamiento --------------------
(async () => {
  try {
    const rows = await readCSV();
    console.log(`✅ Se leyeron ${rows.length} filas del CSV`);

    const airportsMap = new Map<string, any>();
    const flights: { source: string; dest: string; distance: number }[] = [];

    // Crear aeropuertos únicos y vuelos
    for (const row of rows) {
      const srcCode = row['Source Airport Code'];
      const destCode = row['Destination Airport Code'];

      // Agregar aeropuerto origen
      if (!airportsMap.has(srcCode)) {
        airportsMap.set(srcCode, {
          code: srcCode,
          name: row['Source Airport Name'],
          city: row['Source Airport City'],
          country: row['Source Airport Country'],
          lat: parseFloat(row['Source Airport Latitude']),
          lng: parseFloat(row['Source Airport Longitude']),
        });
      }

      // Agregar aeropuerto destino
      if (!airportsMap.has(destCode)) {
        airportsMap.set(destCode, {
          code: destCode,
          name: row['Destination Airport Name'],
          city: row['Destination Airport City'],
          country: row['Destination Airport Country'],
          lat: parseFloat(row['Destination Airport Latitude']),
          lng: parseFloat(row['Destination Airport Longitude']),
        });
      }

      // Calcular distancia y agregar vuelo
      const distance = haversineDistance(
        parseFloat(row['Source Airport Latitude']),
        parseFloat(row['Source Airport Longitude']),
        parseFloat(row['Destination Airport Latitude']),
        parseFloat(row['Destination Airport Longitude'])
      );

      flights.push({ source: srcCode, dest: destCode, distance });
    }

    // -------------------- Generar airports.json --------------------
    const airportsArray = Array.from(airportsMap.values());
    fs.writeFileSync(
      path.join(outputDir, 'airports.json'),
      JSON.stringify(airportsArray, null, 2)
    );
    console.log(
      `🛫 airports.json generado con ${airportsArray.length} aeropuertos`
    );

    // -------------------- Generar flights.json --------------------
    fs.writeFileSync(
      path.join(outputDir, 'flights.json'),
      JSON.stringify(flights, null, 2)
    );
    console.log(`✈️ flights.json generado con ${flights.length} vuelos`);

    // -------------------- Generar adjacency.json --------------------
    const adjacency: Record<string, { code: string; distance: number }[]> = {};
    for (const flight of flights) {
      if (!adjacency[flight.source]) adjacency[flight.source] = [];
      if (!adjacency[flight.dest]) adjacency[flight.dest] = [];
      adjacency[flight.source].push({
        code: flight.dest,
        distance: flight.distance,
      });
      adjacency[flight.dest].push({
        code: flight.source,
        distance: flight.distance,
      }); // grafo no dirigido
    }

    fs.writeFileSync(
      path.join(outputDir, 'adjacency.json'),
      JSON.stringify(adjacency, null, 2)
    );
    console.log(`📊 adjacency.json generado`);
  } catch (err) {
    console.error('❌ Error procesando CSV:', err);
  }
})();
