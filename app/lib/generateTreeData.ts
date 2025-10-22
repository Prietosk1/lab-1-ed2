import { CountryData } from '@/app/types/countryData';
import { TreeNode } from '@/app/types/treeNode';
import dataset from '@/app/data/dataset_climate_change.json';
import { insert } from '@/app/scripts/avlUtils';

function generateTreeData(): TreeNode {
  const countries: CountryData[] = dataset;

  let root: TreeNode | null = null;

  for (const country of countries) {
    const node: TreeNode = {
      name: country.name,
      attributes: {
        avegTemp: country.avgTempChange,
        tempStr: country.avgTempChange.toFixed(5) + '°C',
        code: country.code,
        flag: country.flag,
        height: 1,
      },
      children: [{ name: '' }, { name: '' }],
    };

    root = insert(root, node);
  }

  return root!;
}

export { generateTreeData };
