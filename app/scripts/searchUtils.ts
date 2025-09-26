import { TreeNode } from '@/app/types/treeNode';
import dataset from '@/app/data/dataset_climate_change.json';
import { CountryData } from '@/app/types/countryData';

function getAllNodes(root: TreeNode): TreeNode[] {
  if (!root || root.name === '') return [];
  return [
    ...getAllNodes(root.children[0] as TreeNode),
    root,
    ...getAllNodes(root.children[1] as TreeNode),
  ];
}

function getAverageForYear(yearIndex: number): number {
  const countries: CountryData[] = dataset as CountryData[];
  const values = countries.map((c) => c.temperatures[yearIndex]);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return Number(avg.toFixed(6));
}

function getGlobalAverage(): number {
  const countries: CountryData[] = dataset as CountryData[];
  const allTemps = countries.flatMap((c) => c.temperatures);
  const avg = allTemps.reduce((sum, v) => sum + v, 0) / allTemps.length;
  return Number(avg.toFixed(6));
}

function searchAboveYearAverage(root: TreeNode, year: number): TreeNode[] {
  const yearIndex = year - 1961;
  const threshold = getAverageForYear(yearIndex);
  return getAllNodes(root).filter((node) => {
    const country = (dataset as CountryData[]).find(
      (c) => c.code === node.attributes.code
    );
    return country && country.temperatures[yearIndex] > threshold;
  });
}

function searchBelowGlobalAverage(root: TreeNode, year: number): TreeNode[] {
  const yearIndex = year - 1961;
  const globalAvg = getGlobalAverage();
  return getAllNodes(root).filter((node) => {
    const country = (dataset as CountryData[]).find(
      (c) => c.code === node.attributes.code
    );
    return country && country.temperatures[yearIndex] < globalAvg;
  });
}

function searchByMinAvgTemp(root: TreeNode, min: number): TreeNode[] {
  return getAllNodes(root).filter(
    (node) => node.attributes.temp >= Number(min.toFixed(6))
  );
}

export { searchAboveYearAverage, searchBelowGlobalAverage, searchByMinAvgTemp };
