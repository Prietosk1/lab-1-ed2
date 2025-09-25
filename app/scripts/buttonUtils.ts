import { TreeNode } from '../types/treeNode';
import { getLevelOrderRecursive } from './avlUtils';

function levelWalkthrogh(data: TreeNode) {
  const niveles = getLevelOrderRecursive(data);

  console.log('Recorrido por niveles:', niveles);

  // Mostrar cada nivel en consola
  niveles.forEach((nivel, i) => {
    console.log(`Nivel ${i}: ${nivel.join(' ')}`);
  });
}

export { levelWalkthrogh };
