import { CountryData } from '@/app/types/countryData';
import { TreeNode } from '@/app/types/treeNode';
import dataset from '@/app/data/dataset_climate_change.json';
import { insert } from '@/app/scripts/avlUtils';

export default function generateTreeData(): TreeNode {
  const countries: CountryData[] = dataset as CountryData[];

  let root: TreeNode | null = null;

  for (const country of countries) {
    // Crear un nuevo nodo para el país
    const node: TreeNode = {
      name: country.name,
      attributes: {
        temp: country.avgTempChange,
        tempStr: country.avgTempChange.toFixed(4) + '°C',
        code: country.code,
        flag: country.flag,
        height: 1,
      },
      children: [{ name: '' }, { name: '' }],
    };

    // Insertar el nodo en el árbol
    root = insert(root, node);
  }
  return root!; // Retornar el árbol generado o el placeholder si el árbol está vacío
}
