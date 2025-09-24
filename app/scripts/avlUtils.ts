import { TreeNode } from '@/app/types/treeNode';

// Retorna la altura almacenada en el nodo, o 1 si no está definida
function getHeight(node: TreeNode): number {
  if (!node || node.name === '') return 0; // Si no existe el nodo, su altura es 0
  return node.attributes.height ?? 1;
}

// Actualiza la altura del nodo basado en las alturas de sus hijos
function updateHeight(node: TreeNode): void {
  const leftHeight =
    node.children[0].name === '' ? 0 : getHeight(node.children[0] as TreeNode);
  const rightHeight =
    node.children[1].name === '' ? 0 : getHeight(node.children[1] as TreeNode);

  node.attributes.height = Math.max(leftHeight, rightHeight) + 1;
}

// Calcula el factor de balance del nodo
function getBalance(node: TreeNode): number {
  return (
    getHeight(node.children[1] as TreeNode) -
    getHeight(node.children[0] as TreeNode)
  );
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

function insert(node: TreeNode | null, newNode: TreeNode): TreeNode {
  if (!node || node.name === '') return newNode; // Si el nodo hijo esta vacio, se retornar el nuevo nodo para insertarlo

  // Obtenemos las temperaturas para compararlas
  const newNodeTemp = newNode.attributes.temp;
  const nodeTemp = node.attributes.temp;

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
    newNodeTemp < (node.children[0] as TreeNode).attributes.temp // Verifica que el nuevo nodo es menor que el hijo izquierdo
  ) {
    return rotateRight(node);
  }

  // Caso Derecha Derecha
  if (
    balance > 1 && // Verifica que el nodo esté desbalanceado a la derecha
    newNodeTemp > (node.children[1] as TreeNode).attributes.temp // Verifica que el nuevo nodo es mayor que el hijo derecho
  ) {
    return rotateLeft(node);
  }

  // Caso Izquierda Derecha
  if (
    balance < -1 && // Verifica que el nodo esté desbalanceado a la izquierda
    newNodeTemp > (node.children[0] as TreeNode).attributes.temp // Verifica que el nuevo nodo es mayor que el hijo izquierdo
  ) {
    node.children[0] = rotateLeft(node.children[0] as TreeNode);
    return rotateRight(node);
  }

  // Caso Derecha Izquierda
  if (
    balance > 1 && // Verifica que el nodo esté desbalanceado a la derecha
    newNodeTemp < (node.children[1] as TreeNode).attributes.temp // Verifica que el nuevo nodo es menor que el hijo derecho
  ) {
    node.children[1] = rotateRight(node.children[1] as TreeNode);
    return rotateLeft(node);
  }

  return node;
}

export { insert };
