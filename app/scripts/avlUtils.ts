import { EmptyTreeNode, TreeNode } from '@/app/types/treeNode';
import Tree from 'react-d3-tree';

// Verifica si un nodo es vacío
function isEmpty(node: TreeNode | null): boolean {
  return !node || node.name === '';
}

// Retorna la altura almacenada en el nodo, o 1 si no está definida
function getHeight(node: TreeNode): number {
  if (isEmpty(node)) return 0; // Si no existe el nodo, su altura es 0
  return node.attributes.height;
}

// Actualiza la altura del nodo basado en las alturas de sus hijos
function updateHeight(node: TreeNode): void {
  const leftHeight =
    node.children[0].name === '' ? 0 : getHeight(node.children[0] as TreeNode);
  const rightHeight =
    node.children[1].name === '' ? 0 : getHeight(node.children[1] as TreeNode);

  node.attributes.height = Math.max(leftHeight, rightHeight) + 1;
}

// Rotación derecha
function rotateRight(node: TreeNode): TreeNode {
  const left = node.children[0] as TreeNode;
  const rightOfLeft = left.children[1] as TreeNode;

  // Realizar la rotación
  left.children[1] = node;
  node.children[0] = rightOfLeft;

  // Actualizar alturas
  updateHeight(node);
  updateHeight(left);

  return left;
}

// Rotación izquierda
function rotateLeft(node: TreeNode): TreeNode {
  const right = node.children[1] as TreeNode;
  const leftOfRight = right.children[0] as TreeNode;

  // Realizar la rotación
  right.children[0] = node;
  node.children[1] = leftOfRight;

  // Actualizar alturas
  updateHeight(node);
  updateHeight(right);

  return right;
}

// Recorrido por niveles (recursivo)
function getLevelOrderRecursive(node: TreeNode): string[][] {
  const result: string[][] = [];

  // Para cada nivel, recolectamos los nodos
  for (let i = 1; i <= getHeight(node); i++) {
    const countries: string[] = [];
    getCountriesISO3(node, i, countries);
    result.push(countries);
  }

  return result;
}

// Función auxiliar recursiva que recolecta nodos de un nivel específico
function getCountriesISO3(
  node: TreeNode,
  level: number,
  countries: string[]
): void {
  if (isEmpty(node)) return;

  if (level === 1) {
    countries.push(node.attributes.code); // ISO3 del país
  } else {
    console.log(node.attributes.avegTemp + '\n');
    getCountriesISO3(node.children[0] as TreeNode, level - 1, countries);
    getCountriesISO3(node.children[1] as TreeNode, level - 1, countries);
  }
}

// Insertar un nuevo nodo en el árbol AVL
function insert(node: TreeNode | null, newNode: TreeNode): TreeNode {
  if (!node || node.name === '') return newNode; // Si el nodo hijo esta vacio, se retornar el nuevo nodo para insertarlo

  // Obtenemos las temperaturas para compararlas
  const newNodeTemp = newNode.attributes.avegTemp;
  const nodeTemp = node.attributes.avegTemp;

  if (newNodeTemp < nodeTemp) {
    node.children[0] = insert(node.children[0] as TreeNode, newNode); // Seguira por la izquierda
  }
  if (newNodeTemp > nodeTemp) {
    node.children[1] = insert(node.children[1] as TreeNode, newNode); // Seguira por la derecha
  }

  updateHeight(node); // Actualizamos la altura del nodo actual

  const balance = getBalance(node); // Obtenemos el factor de balance

  // Si el nodo se ha desbalanceado, hay 4 casos

  // Caso Izquierda Izquierda
  if (
    balance < -1 && // Verifica que el nodo esté desbalanceado a la izquierda
    newNodeTemp < (node.children[0] as TreeNode).attributes.avegTemp // Verifica que el nuevo nodo es menor que el hijo izquierdo
  ) {
    return rotateRight(node);
  }

  // Caso Derecha Derecha
  if (
    balance > 1 && // Verifica que el nodo esté desbalanceado a la derecha
    newNodeTemp > (node.children[1] as TreeNode).attributes.avegTemp // Verifica que el nuevo nodo es mayor que el hijo derecho
  ) {
    return rotateLeft(node);
  }

  // Caso Izquierda Derecha
  if (
    balance < -1 && // Verifica que el nodo esté desbalanceado a la izquierda
    newNodeTemp > (node.children[0] as TreeNode).attributes.avegTemp // Verifica que el nuevo nodo es mayor que el hijo izquierdo
  ) {
    node.children[0] = rotateLeft(node.children[0] as TreeNode);
    return rotateRight(node);
  }

  // Caso Derecha Izquierda
  if (
    balance > 1 && // Verifica que el nodo esté desbalanceado a la derecha
    newNodeTemp < (node.children[1] as TreeNode).attributes.avegTemp // Verifica que el nuevo nodo es menor que el hijo derecho
  ) {
    node.children[1] = rotateRight(node.children[1] as TreeNode);
    return rotateLeft(node);
  }

  return node;
}

// a. Obtener el nivel del nodo (raíz = nivel 0)
function getNodeLevel(
  root: TreeNode,
  target: TreeNode,
  level: number = 0
): number {
  if (isEmpty(root)) return -1;
  if (root === target) return level;

  const left = getNodeLevel(root.children[0] as TreeNode, target, level + 1);
  if (left !== -1) return left;

  return getNodeLevel(root.children[1] as TreeNode, target, level + 1);
}

// b. Obtener el factor de balanceo

function getBalance(node: TreeNode): number {
  return (
    getHeight(node.children[1] as TreeNode) -
    getHeight(node.children[0] as TreeNode)
  );
}

// c. Encontrar el padre del nodo
function getParent(root: TreeNode, target: TreeNode): TreeNode | null {
  if (isEmpty(root)) return null;

  if (root.children[0] === target || root.children[1] === target) {
    return root;
  }

  const left = getParent(root.children[0] as TreeNode, target);
  if (left) return left;

  return getParent(root.children[1] as TreeNode, target);
}

// d. Encontrar el abuelo del nodo
function getGrandparent(root: TreeNode, target: TreeNode): TreeNode | null {
  const parent = getParent(root, target);
  if (!parent) return null;
  return getParent(root, parent);
}

// e. Encontrar el tío del nodo
function getUncle(root: TreeNode, target: TreeNode): TreeNode | null {
  const parent = getParent(root, target);
  if (!parent) return null;

  const grandparent = getParent(root, parent);
  if (!grandparent) return null;

  if (grandparent.children[0] === parent) {
    return isEmpty(grandparent.children[1] as TreeNode)
      ? null
      : (grandparent.children[1] as TreeNode);
  } else {
    return isEmpty(grandparent.children[0] as TreeNode)
      ? null
      : (grandparent.children[0] as TreeNode);
  }
}

// Eliminar un nodo por su cambio de temperatura promedio
function deleteNode(root: TreeNode, temp: number): TreeNode | EmptyTreeNode {
  if (!root || isEmpty(root)) return createEmptyNode();

  const targetTemp = Number(temp.toFixed(5));
  const nodeTemp = Number(root.attributes.avegTemp.toFixed(5));

  // Buscar el nodo a eliminar
  if (targetTemp < nodeTemp) {
    root.children[0] = deleteNode(root.children[0] as TreeNode, temp);
  } else if (targetTemp > nodeTemp) {
    root.children[1] = deleteNode(root.children[1] as TreeNode, temp);
  } else {
    // Nodo encontrado
    const left = root.children[0] as TreeNode;
    const right = root.children[1] as TreeNode;

    // Caso 1: sin hijos
    if (isEmpty(left) && isEmpty(right)) {
      return createEmptyNode(); // nodo vacío
    }

    // Caso 2: un hijo
    if (isEmpty(left)) return right;
    if (isEmpty(right)) return left;

    // Caso 3: dos hijos → buscar sucesor (mínimo en subárbol derecho)
    let successor = right;
    while (!isEmpty(successor.children[0] as TreeNode)) {
      successor = successor.children[0] as TreeNode;
    }

    // Copiar datos del sucesor
    root.name = successor.name;
    root.attributes = successor.attributes;

    // Eliminar el sucesor
    root.children[1] = deleteNode(right, successor.attributes.avegTemp);
  }

  // Actualizar altura y balancear
  updateHeight(root);
  const balance = getBalance(root);

  // Rotaciones
  if (balance < -1 && getBalance(root.children[0] as TreeNode) <= 0) {
    return rotateRight(root);
  }

  if (balance > 1 && getBalance(root.children[1] as TreeNode) >= 0) {
    return rotateLeft(root);
  }

  if (balance < -1 && getBalance(root.children[0] as TreeNode) > 0) {
    root.children[0] = rotateLeft(root.children[0] as TreeNode);
    return rotateRight(root);
  }

  if (balance > 1 && getBalance(root.children[1] as TreeNode) < 0) {
    root.children[1] = rotateRight(root.children[1] as TreeNode);
    return rotateLeft(root);
  }

  return root;
}
function createEmptyNode(): EmptyTreeNode {
  return {
    name: '',
  };
}

function findNodeByTemp(root: TreeNode, temp: number): TreeNode | null {
  if (isEmpty(root)) return null;

  // Redondear ambos valores a 4 decimales
  const nodeTemp = Number(root.attributes.avegTemp.toFixed(5));
  const targetTemp = Number(temp.toFixed(5));

  if (nodeTemp === targetTemp) return root;

  return (
    findNodeByTemp(root.children[0] as TreeNode, temp) ||
    findNodeByTemp(root.children[1] as TreeNode, temp)
  );
}

export {
  insert,
  getLevelOrderRecursive,
  findNodeByTemp,
  getNodeLevel,
  getBalance,
  getParent,
  getGrandparent,
  deleteNode,
  getUncle,
};
