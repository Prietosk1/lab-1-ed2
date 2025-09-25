'use client';
import Button from '@/app/ui/Button';
import dynamic from 'next/dynamic';
import Input from '@/app/ui/Input';
import Separator from '@/app/ui/Separator';
import Logo from '@/app/ui/Logo';
import DecimalSlider from '@/app/ui/DecimalSlider';
import { useState } from 'react';
import { TreeNode } from './types/treeNode';
import { getLevelOrderRecursive } from './scripts/avlUtils';
import { generateTreeData } from './scripts/generateTreeData';
import { searchNode } from './scripts/avlUtils';
import { levelWalkthrogh } from './scripts/buttonUtils';

const DynamicAVLTree = dynamic(() => import('@/app/ui/AVLTree'), {
  ssr: false,
});

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode>(generateTreeData()); // Datos del árbol
  const [temp, setTemp] = useState<string>('0.01'); // Temperatura promedio del año a buscar

  return (
    <>
      <div className="flex h-screen w-full flex-col gap-3 p-3 md:flex-row">
        <div className="bg-mask scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray grid w-full auto-rows-min grid-cols-4 gap-3 overflow-auto rounded p-4 md:w-92 md:grid-cols-2">
          <Logo />
          {/* Inserccion */}
          <Separator text="Inserción de pais" />
          <Input
            label="Nombre"
            type="text"
            className="col-span-2 md:col-span-1"
            placeholder="Colombia"
          />
          <Input
            label="Temperatura media"
            className="col-span-2 md:col-span-1"
            type="number"
            placeholder="0.723"
          />
          <Button className="col-span-4 md:col-span-2">Agregar nodo</Button>
          <Separator text="Eliminación y busqueda de nodo por metrica" />

          <Input
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="col-span-2"
            label="Metrica"
            placeholder="0.001"
            type="number"
          />

          <Button
            onClick={() => searchNode(treeData, temp)}
            variant="secondary"
            className="col-span-1"
          >
            Buscar
          </Button>

          <Button className="col-span-1">Eliminar</Button>

          {/* Busqueda por temperatura promedio de año */}
          <Separator text="Busqueda por temperatura promedio de año" />
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

          {/* Configuraciones visuales */}
          <Separator text="Configuraciones visuales" />
          <DecimalSlider
            className="col-span-2"
            label="Profundidad de los nodos"
          />
          <DecimalSlider className="col-span-2" label="Distancia entre nodos" />
        </div>
        <DynamicAVLTree data={treeData} />
      </div>
    </>
  );
}
