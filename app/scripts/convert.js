import fs from 'fs';
import Papa from 'papaparse';
import iso from 'iso-3166-1';

const csvFilePath = './app/data/dataset_climate_change.csv';

const csv = fs.readFileSync(csvFilePath, 'utf8');

const result = Papa.parse(csv, { header: true });

const years = result.meta.fields.filter((col) => col.startsWith('F'));

const enriched = result.data.map((row) => {
  const temperatures = years.map((y) => parseFloat(row[y]));

  const codeISO3 = iso.whereAlpha3(row.ISO3);

  const codeISO2 = codeISO3 ? codeISO3.alpha2.toLowerCase() : 'WLD'; // un = unknown
  console.log(codeISO2); // br or 'unknown'
  const flag =
    codeISO2 == 'WLD' ? null : `https://flagcdn.com/w20/${codeISO2}.png`;

  let tempSum = 0;
  let countriesCount = 0;

  for (let year = 1961; year <= 2022; year++) {
    const key = `F${year}`;
    if (row[key] !== undefined && row[key] !== null) {
      tempSum += parseFloat(row[key]); // asegurar que sea número
      countriesCount++;
    }
  }

  return {
    id: parseInt(row.ObjectId, 10),
    name: row.Country,
    code: row.ISO3,
    temperatures,
    flag,
    avgTempChange: tempSum / countriesCount,
  };
});

// Guardar JSON resultante
fs.writeFileSync(
  './app/data/dataset_climate_change.json',
  JSON.stringify(enriched, null, 2)
);

console.log('✅ dataset.json generado con éxito');
