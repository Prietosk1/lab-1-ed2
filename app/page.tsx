'use client';
import Button from '@/app/ui/Button';
import dynamic from 'next/dynamic';
import Input from '@/app/ui/Input';
import Separator from '@/app/ui/Separator';
import Logo from '@/app/ui/Logo';
import DecimalSlider from '@/app/ui/DecimalSlider';
import { useState } from 'react';
import { TreeNode } from '@/app/types/treeNode';
import { generateTreeData } from '@/app/scripts/generateTreeData';
import { findNodeByTemp, insert } from './scripts/avlUtils';
import dataset from '@/app/data/dataset_climate_change.json';
import { CountryData } from './types/countryData';
import {
  searchAboveYearAverage,
  searchBelowGlobalAverage,
  searchByMinAvgTemp,
} from './scripts/searchUtils';
import {
  addNode,
  deleteCountry,
  findNodeBalance,
  findNodeGrandparent,
  findNodeLevel,
  findNodeParent,
  findNodeUncle,
  levelWalkthrough,
  searchNodeAboveAvg,
  searchNodeBelowAvg,
  searchNodeByAverageTemperature,
  searchNodeByMinAvgTemperature,
} from '@/app/scripts/buttonUtils';

const DynamicAVLTree = dynamic(() => import('@/app/ui/AVLTree'), {
  ssr: false,
});

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode>(generateTreeData());
  const [temp, setTemp] = useState<string>('0.01');
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newTemp, setNewTemp] = useState<string>('');
  const [newNameOrCode, setNewNameOrCode] = useState<string>('');
  const [searchYear, setSearchYear] = useState<number>(2022);
  const [minAvgTemp, setMinAvgTemp] = useState<number>(0.5);
  const [searchResults, setSearchResults] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  return (
    <>
      <div className="flex h-screen w-full flex-col gap-3 p-3 md:flex-row">
        <div className="bg-mask scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray grid w-full auto-rows-min grid-cols-4 gap-3 overflow-auto rounded p-4 md:w-92 md:grid-cols-2">
          <Logo />
          {/* Inserccion */}
          <Separator text="Inserción de pais" />
          <Input
            label="Nombre o código ISO"
            type="text"
            className="col-span-2"
            placeholder="Colombia o COL"
            value={newNameOrCode}
            onChange={(e) => setNewNameOrCode(e.target.value)}
          />

          <Button
            className="col-span-4 md:col-span-2"
            onClick={() =>
              addNode(newNameOrCode, treeData, setTreeData, setNewNameOrCode)
            }
          >
            Agregar nodo
          </Button>
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
          <Button
            onClick={() =>
              searchNodeByAverageTemperature(treeData, Number(temp))
            }
            variant="secondary"
            className="col-span-1"
          >
            Buscar
          </Button>

          {/* Eliminar */}
          <Button
            className="col-span-1"
            onClick={() => deleteCountry(treeData, Number(temp), setTreeData)}
          >
            Eliminar
          </Button>

          <Separator text="Búsqueda por temperatura promedio de año" />

          <Input
            className="col-span-2 md:col-span-2"
            label="Año"
            type="number"
            value={searchYear}
            onChange={(e) => setSearchYear(Number(e.target.value))}
            max={2022}
            min={1961}
            maxLength={4}
          />

          <Button
            className="col-span-1"
            onClick={() =>
              searchNodeBelowAvg(
                treeData,
                searchYear,
                setSearchResults,
                setSelectedNode
              )
            }
          >
            Menor al promedio global
          </Button>

          <Button
            variant="secondary"
            className="col-span-1"
            onClick={() =>
              searchNodeAboveAvg(
                treeData,
                searchYear,
                setSearchResults,
                setSelectedNode
              )
            }
          >
            Mayor al promedio del año
          </Button>

          <Separator text="Búsqueda por temperatura media mínima" />

          <Input
            className="col-span-2 md:col-span-2"
            label="Temperatura mínima"
            type="number"
            value={minAvgTemp}
            onChange={(e) => setMinAvgTemp(Number(e.target.value))}
          />

          <Button
            className="col-span-2"
            onClick={() =>
              searchNodeByMinAvgTemperature(
                treeData,
                minAvgTemp,
                setSearchResults,
                setSelectedNode
              )
            }
          >
            Buscar por temperatura media
          </Button>

          {/* Recorrido por niveles */}
          <Separator text="Recorrido" />
          <Button
            onClick={() => levelWalkthrough(treeData)}
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
            onClick={() => findNodeLevel(treeData, Number(temp))}
          >
            a. Obtener nivel
          </Button>

          {/* b. Balance */}
          <Button
            className="col-span-2"
            onClick={() => findNodeBalance(treeData, Number(temp))}
          >
            b. Factor de balanceo
          </Button>

          {/* c. Padre */}
          <Button
            className="col-span-2"
            onClick={() => findNodeParent(treeData, Number(temp))}
          >
            c. Padre
          </Button>

          {/* d. Abuelo */}
          <Button
            className="col-span-2"
            onClick={() => findNodeGrandparent(treeData, Number(temp))}
          >
            d. Abuelo
          </Button>

          {/* e. Tío */}
          <Button
            className="col-span-2"
            onClick={() => findNodeUncle(treeData, Number(temp))}
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
