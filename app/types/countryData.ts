export interface CountryData {
  id: number;
  name: string;
  code: string; // ISO3 code
  temperatures: number[]; // Temperaturas desde 1961 hasta 2022
  flag: string | null; // URL de la bandera
  avgTempChange: number; // Cambio promedio de temperatura por año
}
