import { TreeNode } from '../types/treeNode';
import {
  deleteNode,
  findNodeByTemp,
  getBalance,
  getGrandparent,
  getLevelOrderRecursive,
  getNodeLevel,
  getParent,
  getUncle,
} from './avlUtils';

function formatNodeInfo(
  relative: TreeNode | null,
  label: string,
  original: TreeNode
) {
  if (!relative) {
    console.log(
      `${label} del nodo ${original.name} (${original.attributes.code}, temp=${original.attributes.avegTemp}): Ninguno`
    );
  } else {
    console.log(
      `${label} del nodo ${original.name} (${original.attributes.code}, temp=${original.attributes.avegTemp}): ` +
        `${relative.name} (${relative.attributes.code}, temp=${relative.attributes.avegTemp})`
    );
  }
}

function levelWalkthrough(data: TreeNode): void {
  const niveles = getLevelOrderRecursive(data);

  console.log('Recorrido por niveles:', niveles);

  // Mostrar cada nivel en consola
  niveles.forEach((nivel, i) => {
    console.log(`Nivel ${i + 1}: ${nivel.join(' ')}`);
  });
}

function searchNodeByAverageTemperature(data: TreeNode, avgTemp: number): void {
  const node = findNodeByTemp(data, avgTemp);
  if (node) {
    console.log(
      `Nodo encontrado: ${node.name} (${node.attributes.code}, temp=${avgTemp})`
    );
  } else {
    console.log(`No se encontró ningún nodo con temp=${avgTemp}`);
  }
}

function deleteCountry(
  data: TreeNode,
  temp: number,
  setTreeData: Function
): void {
  const node = findNodeByTemp(data, temp);

  if (!node) {
    console.log(`No se encontró ningún nodo con temp=${temp}`);
    return;
    // setDeletedMessage(msg);
  }

  const msg = `Nodo eliminado: ${node.name} (${node.attributes.code}, temp=${temp})`;
  console.log(msg);
  const updatedTree = deleteNode(data, temp);
  setTreeData(updatedTree);
}

function findNodeLevel(data: TreeNode, temp: number) {
  const node = findNodeByTemp(data, Number(temp));

  if (!node) {
    console.log('Nodo no encontrado');
    return;
  }

  const level = getNodeLevel(data, node);
  console.log(
    `Nivel del nodo ${node.name} (${node.attributes.code}, temp=${temp}}): ${level}`
  );
}

function findNodeBalance(data: TreeNode, temp: number) {
  const node = findNodeByTemp(data, temp);

  if (!node) {
    console.log('Nodo no encontrado');
    return;
  }

  const balance = getBalance(node);
  console.log(
    `Balance del nodo ${node.name} (${node.attributes.code}, temp=${temp}): ${balance}`
  );
}

function findNodeParent(data: TreeNode, temp: number) {
  const node = findNodeByTemp(data, temp);

  if (!node) {
    console.log('Nodo no encontrado');
    return;
  }

  const padre = getParent(data, node);
  formatNodeInfo(padre, 'Padre', node);
}

function findNodeGrandparent(data: TreeNode, temp: number) {
  const node = findNodeByTemp(data, temp);

  if (!node) {
    console.log('Nodo no encontrado');
    return;
  }

  const abuelo = getGrandparent(data, node);
  formatNodeInfo(abuelo, 'Abuelo', node);
}

function findNodeUncle(data: TreeNode, temp: number) {
  const node = findNodeByTemp(data, temp);

  if (!node) {
    console.log('Nodo no encontrado');
    return;
  }

  const tio = getUncle(data, node);
  formatNodeInfo(tio, 'Tío', node);
}

export {
  levelWalkthrough,
  searchNodeByAverageTemperature,
  deleteCountry,
  findNodeLevel,
  findNodeBalance,
  findNodeParent,
  findNodeGrandparent,
  findNodeUncle,
};
