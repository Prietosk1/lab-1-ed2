'use client';
import Button from '@/app/ui/Button';
import dynamic from 'next/dynamic';
import Input from '@/app/ui/Input';
import Separator from '@/app/ui/Separator';
import Logo from '@/app/ui/Logo';
import DecimalSlider from '@/app/ui/DecimalSlider';
import { useState } from 'react';
import { TreeNode } from './types/treeNode';
import {
  findNodeByTemp,
  getBalance,
  getGrandparent,
  getLevelOrderRecursive,
  getNodeLevel,
  getParent,
  getUncle,
  deleteNode,
} from './scripts/avlUtils';
import { generateTreeData } from './scripts/generateTreeData';
import { levelWalkthrogh } from './scripts/buttonUtils';

const DynamicAVLTree = dynamic(() => import('@/app/ui/AVLTree'), {
  ssr: false,
});

function formatNodeInfo(
  relative: TreeNode | null,
  label: string,
  original: TreeNode
) {
  if (!relative) {
    console.log(
      `${label} del nodo ${original.name} (${original.attributes.code}, temp=${original.attributes.temp}): Ninguno`
    );
  } else {
    console.log(
      `${label} del nodo ${original.name} (${original.attributes.code}, temp=${original.attributes.temp}): ` +
        `${relative.name} (${relative.attributes.code}, temp=${relative.attributes.temp})`
    );
  }
}

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode>(generateTreeData());
  const [temp, setTemp] = useState<string>('0.01');
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

  return (
    <>
      <div className="flex h-screen w-full flex-col gap-3 p-3 md:flex-row">
        <div className="bg-mask scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray grid w-full auto-rows-min grid-cols-4 gap-3 overflow-auto rounded p-4 md:w-92 md:grid-cols-2">
          <Logo />

          {/* Inserción */}
          <Separator text="Inserción" />
          <Button className="col-span-4 md:col-span-2">Agregar nodo</Button>

          {/* Eliminación y búsqueda */}
          <Separator text="Eliminación y búsqueda de nodo por métrica" />
          <Input
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="col-span-2"
            label="Métrica"
            placeholder="0.001"
            type="number"
          />

          {/* Buscar */}
          <Button
            onClick={() => {
              const node = findNodeByTemp(treeData, Number(temp));
              if (node) {
                console.log(
                  `Nodo encontrado: ${node.name} (${node.attributes.code}, temp=${node.attributes.temp.toFixed(4)})`
                );
              } else {
                console.log(
                  `No se encontró ningún nodo con temp=${Number(temp).toFixed(4)}`
                );
              }
            }}
            variant="secondary"
            className="col-span-1"
          >
            Buscar
          </Button>

          {/* Eliminar */}
          <Button
            className="col-span-1"
            onClick={() => {
              const tempValue = Number(temp);
              const nodeToDelete = findNodeByTemp(treeData, tempValue);

              if (!nodeToDelete) {
                const msg = `No se encontró ningún nodo con temp=${tempValue.toFixed(4)}`;
                console.log(msg);
                setDeletedMessage(msg);
                return;
              }
              const msg = `Nodo eliminado: ${nodeToDelete.name} (${nodeToDelete.attributes.code}, temp=${nodeToDelete.attributes.temp.toFixed(4)})`;
              console.log(msg);
              const updatedTree = deleteNode(treeData, tempValue);
              setTreeData(updatedTree!);

              setDeletedMessage(msg);
            }}
          >
            Eliminar
          </Button>

          {/* Búsqueda por temperatura promedio de año */}
          <Separator text="Búsqueda por temperatura promedio de año" />
          <Input
            className="col-span-4 md:col-span-2"
            label="Año"
            type="number"
            placeholder="2022"
            max={2022}
            min={1961}
          />
          <Button className="col-span-2">Menor al promedio</Button>
          <Button variant="secondary" className="col-span-2">
            Mayor al promedio
          </Button>

          {/* Recorrido por niveles */}
          <Separator text="Recorrido" />
          <Button
            onClick={() => levelWalkthrogh(treeData)}
            variant="primary"
            className="col-span-2"
          >
            Hacer Recorrido Por Niveles
          </Button>

          {/* Operaciones sobre nodo */}
          <Separator text="Operaciones sobre nodo (por métrica)" />

          {/* a. Nivel */}
          <Button
            className="col-span-2"
            onClick={() => {
              const node = findNodeByTemp(treeData, Number(temp));
              if (node) {
                const nivel = getNodeLevel(treeData, node);
                console.log(
                  `Nivel del nodo ${node.name} (${node.attributes.code}, temp=${node.attributes.temp}): ${nivel}`
                );
              } else {
                console.log('Nodo no encontrado');
              }
            }}
          >
            a. Obtener nivel
          </Button>

          {/* b. Balance */}
          <Button
            className="col-span-2"
            onClick={() => {
              const node = findNodeByTemp(treeData, Number(temp));
              if (node) {
                const balance = getBalance(node);
                console.log(
                  `Balance del nodo ${node.name} (${node.attributes.code}, temp=${node.attributes.temp}): ${balance}`
                );
              } else {
                console.log('Nodo no encontrado');
              }
            }}
          >
            b. Factor de balanceo
          </Button>

          {/* c. Padre */}
          <Button
            className="col-span-2"
            onClick={() => {
              const node = findNodeByTemp(treeData, Number(temp));
              if (node) {
                const padre = getParent(treeData, node);
                formatNodeInfo(padre, 'Padre', node);
              } else {
                console.log('Nodo no encontrado');
              }
            }}
          >
            c. Padre
          </Button>

          {/* d. Abuelo */}
          <Button
            className="col-span-2"
            onClick={() => {
              const node = findNodeByTemp(treeData, Number(temp));
              if (node) {
                const abuelo = getGrandparent(treeData, node);
                formatNodeInfo(abuelo, 'Abuelo', node);
              } else {
                console.log('Nodo no encontrado');
              }
            }}
          >
            d. Abuelo
          </Button>

          {/* e. Tío */}
          <Button
            className="col-span-2"
            onClick={() => {
              const node = findNodeByTemp(treeData, Number(temp));
              if (node) {
                const tio = getUncle(treeData, node);
                formatNodeInfo(tio, 'Tío', node);
              } else {
                console.log('Nodo no encontrado');
              }
            }}
          >
            e. Tío
          </Button>

          {/* Configuraciones visuales */}
          <Separator text="Configuraciones visuales" />
          <DecimalSlider
            className="col-span-2"
            label="Profundidad de los nodos"
          />
          <DecimalSlider className="col-span-2" label="Distancia entre nodos" />
        </div>

        {/* Visualización del árbol */}
        <DynamicAVLTree key={JSON.stringify(treeData)} data={treeData} />
      </div>
    </>
  );
}
