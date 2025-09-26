import { TreeNode } from '../types/treeNode';
import dataset from '@/app/data/dataset_climate_change.json';
import {
  deleteNode,
  findNodeByTemp,
  getBalance,
  getGrandparent,
  getLevelOrderRecursive,
  getNodeLevel,
  getParent,
  getUncle,
  insert,
} from './avlUtils';
import { CountryData } from '../types/countryData';
import {
  searchAboveYearAverage,
  searchBelowGlobalAverage,
  searchByMinAvgTemp,
} from './searchUtils';
import Swal from 'sweetalert2';

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
    console.log(`Nivel ${i}: ${nivel.join(' ')}`);
  });
}

function searchNodeByAverageTemperature(data: TreeNode, avgTemp: number): void {
  const node = findNodeByTemp(data, avgTemp);
  if (!node) {
    Swal.fire({
      title: 'Nodo no encontrado...',
      text: `Opps... Parece que no se encontro ningun nodo con dicha temperatura, intenta nuevamente!`,
      icon: 'error',
      confirmButtonText: 'Okay',
    });
  }
}

function deleteCountry(
  data: TreeNode,
  temp: number,
  setTreeData: Function,
  setTemp: Function,
  setDisplayTreeData: Function
): void {
  const nodeToDelete = findNodeByTemp(data, temp);

  if (!nodeToDelete) {
    Swal.fire({
      title: 'Nodo no encontrado...',
      text: `Opps... Parece que no se encontro ningun nodo con dicha temperatura, intenta nuevamente!`,
      icon: 'error',
      confirmButtonText: 'Okay',
    });
    return;
  }
  Swal.fire({
    title: 'Nodo eliminado con exito!',
    text: `El nodo ${nodeToDelete.name} - ${nodeToDelete.attributes.code} ha sido eliminado correctamente`,
    icon: 'success',
    confirmButtonText: 'Okay',
  });

  const msg = `Nodo eliminado: ${nodeToDelete.name} (${nodeToDelete.attributes.code}, temp=${nodeToDelete.attributes.avegTemp.toFixed(5)})`;
  console.log(msg);
  const updatedTree = deleteNode(data, temp);
  setTreeData(updatedTree! as TreeNode);
  setDisplayTreeData(updatedTree);

  setTemp('');
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

function addNode(
  name: string,
  data: TreeNode,
  setTreeData: Function,
  setNewNameOrCode: Function
) {
  const input = name.trim().toLowerCase();
  if (!input) {
    console.log('Entrada inválida');
    return;
  }

  const countries: CountryData[] = dataset;
  let match = countries.find(
    (c) =>
      c.name.trim().toLowerCase() === input ||
      c.code.trim().toLowerCase() === input
  );

  // Si no existe, generar país nuevo
  if (!match) {
    const generateUniqueCountry = (): CountryData => {
      let avg = 0;
      let temps: number[] = [];

      do {
        const base = Math.random() * 1.0 - 0.1; // base entre -0.1 y 0.9
        temps = Array.from({ length: 62 }, () => {
          const variation = (Math.random() - 0.5) * 0.4; // ±0.2
          const value = Math.min(0.9, Math.max(-0.1, base + variation));
          return Number(value.toFixed(3));
        });

        avg = Number(
          (temps.reduce((sum, t) => sum + t, 0) / temps.length).toFixed(6)
        );
      } while (findNodeByTemp(data, avg));

      const newId = Math.max(...countries.map((c) => c.id)) + 1;
      const newCode = input.slice(0, 3).toUpperCase();

      return {
        id: newId,
        name: input.charAt(0).toUpperCase() + input.slice(1),
        code: newCode,
        temperatures: temps,
        flag: '',
        avgTempChange: avg,
      };
    };

    match = generateUniqueCountry();
    countries.push(match); // Simulado: en memoria
    console.log(`Nuevo país generado: ${match.name} (${match.code})`);
  }

  // Verificar que el promedio no exista en el árbol (por si el país sí existía)
  if (findNodeByTemp(data, match.avgTempChange)) {
    console.log(
      `Ya existe un nodo con temp=${match.avgTempChange.toFixed(6)}. No se puede insertar duplicado.`
    );
    return;
  }

  const newNode: TreeNode = {
    name: match.name,
    attributes: {
      avegTemp: match.avgTempChange,
      tempStr: match.avgTempChange.toFixed(6) + '°C',
      code: match.code,
      flag: match.flag,
      height: 1,
    },
    children: [{ name: '' }, { name: '' }],
  };

  const updatedTree = insert(data, newNode);
  setTreeData(updatedTree);

  console.log(
    `Nodo agregado: ${newNode.name} (${newNode.attributes.code}, temp=${newNode.attributes.avegTemp.toFixed(6)})`
  );

  setNewNameOrCode('');
}

function searchNodeBelowAvg(
  data: TreeNode,
  year: number,
  setSearchResults: Function,
  setSelectedNode: Function
) {
  const results = searchBelowGlobalAverage(data, year);
  setSearchResults(results);
  setSelectedNode(null); // Limpia selección previa

  if (results.length === 1) {
    setSelectedNode(results[0]); // Selección automática
  }

  console.log(`Nodos con temp < promedio global en ${year}:`, results);
}

function searchNodeAboveAvg(
  data: TreeNode,
  year: number,
  setSearchResults: Function,
  setSelectedNode: Function
) {
  const results = searchAboveYearAverage(data, year);
  setSearchResults(results);
  setSelectedNode(null); // Limpia selección previa

  if (results.length === 1) {
    setSelectedNode(results[0]); // Selección automática
  }

  console.log(`Nodos con temp > promedio en ${year}:`, results);
}

function searchNodeByMinAvgTemperature(
  data: TreeNode,
  temp: number,
  setSearchResults: Function,
  setSelectedNode: Function
) {
  const results = searchByMinAvgTemp(data, temp);
  setSearchResults(results);
  setSelectedNode(null); // Limpia selección previa

  if (results.length === 1) {
    setSelectedNode(results[0]); // Selección automática
  }

  console.log(`Nodos con temp media >= ${temp}:`, results);
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
  addNode,
  searchNodeBelowAvg,
  searchNodeAboveAvg,
  searchNodeByMinAvgTemperature,
};
