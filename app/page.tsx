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
  insert,
} from './scripts/avlUtils';
import { generateTreeData } from './scripts/generateTreeData';
import { deleteCountry, levelWalkthrough } from './scripts/buttonUtils';
import dataset from '@/app/data/dataset_climate_change.json';
import { CountryData } from './types/countryData';
import {
  searchAboveYearAverage,
  searchBelowGlobalAverage,
  searchByMinAvgTemp,
} from './scripts/searchUtils';
import Swal from 'sweetalert2';

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
      `${label} del nodo ${original.name} (${original.attributes.code}, temp=${original.attributes.avegTemp}): Ninguno`
    );
  } else {
    console.log(
      `${label} del nodo ${original.name} (${original.attributes.code}, temp=${original.attributes.avegTemp}): ` +
        `${relative.name} (${relative.attributes.code}, temp=${relative.attributes.avegTemp})`
    );
  }
}

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode>(generateTreeData());
  const [temp, setTemp] = useState<string>('0.01');
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newTemp, setNewTemp] = useState('');
  const [newNameOrCode, setNewNameOrCode] = useState('');
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
            onClick={() => {
              const input = newNameOrCode.trim().toLowerCase();
              if (!input) {
                console.log('Entrada inválida');
                return;
              }

              const countries: CountryData[] = dataset as CountryData[];
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
                      const value = Math.min(
                        0.9,
                        Math.max(-0.1, base + variation)
                      );
                      return Number(value.toFixed(3));
                    });

                    avg = Number(
                      (
                        temps.reduce((sum, t) => sum + t, 0) / temps.length
                      ).toFixed(6)
                    );
                  } while (findNodeByTemp(treeData, avg));

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
                console.log(
                  `Nuevo país generado: ${match.name} (${match.code})`
                );
              }

              // Verificar que el promedio no exista en el árbol (por si el país sí existía)
              if (findNodeByTemp(treeData, match.avgTempChange)) {
                console.log(
                  `Ya existe un nodo con temp=${match.avgTempChange.toFixed(4)}. No se puede insertar duplicado.`
                );
                return;
              }

              const newNode: TreeNode = {
                name: match.name,
                attributes: {
                  avegTemp: match.avgTempChange,
                  tempStr: match.avgTempChange.toFixed(4) + '°C',
                  code: match.code,
                  flag: match.flag,
                  height: 1,
                },
                children: [{ name: '' }, { name: '' }],
              };

              const updatedTree = insert(treeData, newNode);
              setTreeData(updatedTree);

              console.log(
                `Nodo agregado: ${newNode.name} (${newNode.attributes.code}, temp=${newNode.attributes.avegTemp.toFixed(4)})`
              );

              setNewNameOrCode('');
            }}
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
            onClick={() => {
              const tempValue = Number(temp);
              const node = findNodeByTemp(treeData, tempValue);

              if (node) {
                setSearchResults([node]); // Solo ese nodo en el combo
                setSelectedNode(node); // Selección automática
                console.log(
                  `Nodo encontrado: ${node.name} (${node.attributes.code}, temp=${node.attributes.avegTemp.toFixed(4)})`
                );
              } else {
                setSearchResults([]);
                setSelectedNode(null);
                console.log(
                  `No se encontró ningún nodo con temp=${tempValue.toFixed(4)}`
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
              deleteCountry(treeData, Number(temp), setTreeData, setTemp);
              // const tempValue = Number(temp);
              // const nodeToDelete = findNodeByTemp(treeData, tempValue);

              // if (!nodeToDelete) {
              //   const msg = `No se encontró ningún nodo con temp=${tempValue.toFixed(5)}`;
              //   console.log(msg);
              //   setDeletedMessage(msg);
              //   return;
              // }
              // Swal.fire({
              //   title: 'Nodo eliminado con exito!',
              //   text: 'Do you want to continue',
              //   icon: 'success',
              //   confirmButtonText: 'Cool',
              // });

              // const msg = `Nodo eliminado: ${nodeToDelete.name} (${nodeToDelete.attributes.code}, temp=${nodeToDelete.attributes.avegTemp.toFixed(5)})`;
              // console.log(msg);
              // const updatedTree = deleteNode(treeData, tempValue);
              // setTreeData(updatedTree! as TreeNode);
              // setTreeData(treeData);

              // setTemp('');
            }}
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
          />

          <Button
            className="col-span-1"
            onClick={() => {
              const results = searchBelowGlobalAverage(treeData, searchYear);
              setSearchResults(results);
              setSelectedNode(null); // Limpia selección previa

              if (results.length === 1) {
                setSelectedNode(results[0]); // Selección automática
              }

              console.log(
                `Nodos con temp < promedio global en ${searchYear}:`,
                results
              );
            }}
          >
            Menor al promedio global
          </Button>

          <Button
            variant="secondary"
            className="col-span-1"
            onClick={() => {
              const results = searchAboveYearAverage(treeData, searchYear);
              setSearchResults(results);
              setSelectedNode(null); // Limpia selección previa

              if (results.length === 1) {
                setSelectedNode(results[0]); // Selección automática
              }

              console.log(
                `Nodos con temp > promedio en ${searchYear}:`,
                results
              );
            }}
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
            onClick={() => {
              const results = searchByMinAvgTemp(treeData, minAvgTemp);
              setSearchResults(results);
              setSelectedNode(null); // Limpia selección previa

              if (results.length === 1) {
                setSelectedNode(results[0]); // Selección automática
              }

              console.log(`Nodos con temp media >= ${minAvgTemp}:`, results);
            }}
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

          <Separator text="Operaciones sobre nodo seleccionado" />

          {searchResults.length > 0 && (
            <select
              className="col-span-2 rounded bg-white p-2 text-black"
              value={selectedNode?.attributes.code || ''}
              onChange={(e) => {
                const selected = searchResults.find(
                  (n) => n.attributes.code === e.target.value
                );
                setSelectedNode(selected || null);
              }}
            >
              <option value="">Seleccionar nodo</option>
              {searchResults.map((node) => (
                <option key={node.attributes.code} value={node.attributes.code}>
                  {node.name} ({node.attributes.code})
                </option>
              ))}
            </select>
          )}

          {selectedNode ? (
            <>
              <Button
                className="col-span-2"
                onClick={() => {
                  const nivel = getNodeLevel(treeData, selectedNode);
                  console.log(
                    `Nivel del nodo ${selectedNode.name} (${selectedNode.attributes.code}, temp=${selectedNode.attributes.avegTemp.toFixed(4)}): ${nivel}`
                  );
                }}
              >
                a. Nivel
              </Button>

              <Button
                className="col-span-2"
                onClick={() => {
                  const balance = getBalance(selectedNode);
                  console.log(
                    `Balance del nodo ${selectedNode.name} (${selectedNode.attributes.code}, temp=${selectedNode.attributes.avegTemp.toFixed(4)}): ${balance}`
                  );
                }}
              >
                b. Balance
              </Button>

              <Button
                className="col-span-2"
                onClick={() => {
                  const padre = getParent(treeData, selectedNode);
                  formatNodeInfo(padre, 'Padre', selectedNode);
                }}
              >
                c. Padre
              </Button>

              <Button
                className="col-span-2"
                onClick={() => {
                  const abuelo = getGrandparent(treeData, selectedNode);
                  formatNodeInfo(abuelo, 'Abuelo', selectedNode);
                }}
              >
                d. Abuelo
              </Button>

              <Button
                className="col-span-2"
                onClick={() => {
                  const tio = getUncle(treeData, selectedNode);
                  formatNodeInfo(tio, 'Tío', selectedNode);
                }}
              >
                e. Tío
              </Button>
            </>
          ) : (
            <div className="col-span-2 text-sm font-medium text-red-600">
              No hay nodo seleccionado para operar.
            </div>
          )}

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
