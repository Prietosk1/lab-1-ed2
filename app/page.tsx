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

import iso from 'iso-3166-1';

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
  const [displayTreeData, setDisplayTreeData] =
    useState<TreeNode>(generateTreeData());
  const [temp, setTemp] = useState<string>('');
  const [newNameOrCode, setNewNameOrCode] = useState('');
  const [searchYear, setSearchYear] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [nodeInfo, setNodeInfo] = useState<string>('');
  const [nivelesRecorrido, setNivelesRecorrido] = useState<string[][]>([]);

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
          {/* Agregar nodo */}
          <Button
            className="col-span-4 md:col-span-2"
            onClick={() => {
              const input = newNameOrCode.trim().toLowerCase();
              if (!input || input === '') {
                Swal.fire({
                  title: 'Campo vacio',
                  text: `Opps... El campo esta vacio, por favor ingrese un nombre`,
                  icon: 'error',
                  confirmButtonText: 'Okay',
                });
                return;
              }

              if (input.length < 3) {
                Swal.fire({
                  title: 'Nombre invalido',
                  text: `Opps.. El nombre ingresado debe ser mayor de 3 letras, por favor intente nuevamente.`,
                  icon: 'info',
                  confirmButtonText: 'Okay',
                });
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
                  const newCode = input.slice(0, 4).toUpperCase();

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
                  `Ya existe un nodo con temp=${match.avgTempChange.toFixed(5)}. No se puede insertar duplicado.`
                );
                return;
              }

              const newNode: TreeNode = {
                name: match.name,
                attributes: {
                  avegTemp: match.avgTempChange,
                  tempStr: match.avgTempChange.toFixed(5) + '°C',
                  code: match.code,
                  flag: match.flag,
                  height: 1,
                },
                children: [{ name: '' }, { name: '' }],
              };

              const updatedTree = insert(treeData, newNode);
              setTreeData(updatedTree);
              setDisplayTreeData(updatedTree);

              console.log(
                `Nodo agregado: ${newNode.name} (${newNode.attributes.code}, temp=${newNode.attributes.avegTemp.toFixed(5)})`
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
            label="Temperatura"
            placeholder="0.001"
            type="number"
          />
          {/* Buscar */}
          <Button
            onClick={() => {
              const tempValue = Number(temp);
              const node = findNodeByTemp(treeData, tempValue);

              if (node) {
                setSearchResults([node]); // Solo ese nodo en el combo
                setSelectedNode(node); // Selección automática
                Swal.fire({
                  title: 'Nodo encontrado con exito!',
                  text: `Se ha encontrado ${node.name} - ${node.attributes.code}, acontinuación puede realizar sus respectivas operaciones.`,
                  icon: 'success',
                  confirmButtonText: 'Okay',
                });
              } else {
                setSearchResults([]);
                setSelectedNode(null);
                Swal.fire({
                  title: 'Nodo no encontrado...',
                  text: `Opps... Parece que no se encontro ningun nodo con dicha temperatura, intenta nuevamente!`,
                  icon: 'error',
                  confirmButtonText: 'Okay',
                });
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
              deleteCountry(
                treeData,
                Number(temp),
                setTreeData,
                setTemp,
                setDisplayTreeData
              );
            }}
          >
            Eliminar
          </Button>
          {/* Temperatura media */}
          <Button
            className="col-span-2"
            onClick={() => {
              const results = searchByMinAvgTemp(treeData, Number(temp));
              setSearchResults(results);
              setSelectedNode(null); // Limpia selección previa

              if (results.length === 1) {
                setSelectedNode(results[0]); // Selección automática
                Swal.fire({
                  title: 'Nodo encontrado con exito!',
                  text: `Se ha encontrado ${results[0].name} - ${results[0].attributes.code}, acontinuación puede realizar sus respectivas operaciones.`,
                  icon: 'success',
                  confirmButtonText: 'Okay',
                });
              } else {
                Swal.fire({
                  title: 'Nodos encontrados con exito!',
                  text: `Se ha encontrado los nodos que coinciden con la busqueda, acontinuación elija uno para realizar sus respectivas operaciones.`,
                  icon: 'success',
                  confirmButtonText: 'Okay',
                });
              }
              setTemp('');
            }}
          >
            Buscar por temperatura media
          </Button>

          <Separator text="Búsqueda por temperatura promedio de año" />

          <Input
            className="col-span-2 md:col-span-2"
            label="Año"
            type="number"
            value={searchYear}
            placeholder="2022"
            onChange={(e) => setSearchYear(e.target.value)}
            max={2022}
            min={1961}
            maxLength={5}
          />

          <Button
            className="col-span-1"
            onClick={() => {
              const year = Number(searchYear);
              if (searchYear === '' || year < 1961 || year > 2022) {
                Swal.fire({
                  title: 'Fecha no valida',
                  text: `Opps... La fecha que has ingresado no es valida, el rango permitido es de 1961 a 2022, intenta nuevamente!`,
                  icon: 'warning',
                  confirmButtonText: 'Okay',
                });
                return;
              }

              const results = searchBelowGlobalAverage(treeData, Number(year));
              if (results.length === 1) {
                setSelectedNode(results[0]); // Selección automática
              }

              setSearchResults(results);
              setSelectedNode(null); // Limpia selección previa

              let newTreeRoot: TreeNode | null = null;

              results.forEach((node) => {
                const newNode: TreeNode = {
                  name: node.name,
                  attributes: {
                    avegTemp: node.attributes.avegTemp,
                    code: node.attributes.code,
                    flag: node.attributes.flag,
                    height: node.attributes.height,
                    tempStr: node.attributes.tempStr,
                  },
                  children: [{ name: '' }, { name: '' }],
                };

                newTreeRoot = insert(newTreeRoot, newNode);
                console.log(newNode);
              });
              setDisplayTreeData(newTreeRoot!);
            }}
          >
            Menor al promedio global
          </Button>

          <Button
            variant="secondary"
            className="col-span-1"
            onClick={() => {
              const year = Number(searchYear);
              if (searchYear === '' || year < 1961 || year > 2022) {
                Swal.fire({
                  title: 'Fecha no valida',
                  text: `Opps... La fecha que has ingresado no es valida, el rango permitido es de 1961 a 2022, intenta nuevamente!`,
                  icon: 'warning',
                  confirmButtonText: 'Okay',
                });
                return;
              }

              const results = searchAboveYearAverage(
                treeData,
                Number(searchYear)
              );

              if (results.length === 1) {
                setSelectedNode(results[0]); // Selección automática
              }

              setSearchResults(results);
              setSelectedNode(null); // Limpia selección previa

              let newTreeRoot: TreeNode | null = null;

              results.forEach((node) => {
                const newNode: TreeNode = {
                  name: node.name,
                  attributes: {
                    avegTemp: node.attributes.avegTemp,
                    code: node.attributes.code,
                    flag: node.attributes.flag,
                    height: node.attributes.height,
                    tempStr: node.attributes.tempStr,
                  },
                  children: [{ name: '' }, { name: '' }],
                };

                newTreeRoot = insert(newTreeRoot, newNode);
                console.log(newNode);
                console.log(node);
              });

              setDisplayTreeData(newTreeRoot!);
            }}
          >
            Mayor al promedio del año
          </Button>

          {searchResults.length > 0 && (
            <>
              <Separator text="Operaciones disponibles" />
              <select
                className="bg-accent col-span-2 cursor-pointer rounded p-2 text-xs font-bold text-gray-300 transition-all duration-150 ease-in outline-none hover:scale-103"
                value={selectedNode?.attributes.code || ''}
                onChange={(e) => {
                  const selected = searchResults.find(
                    (n) => n.attributes.code === e.target.value
                  );
                  setSelectedNode(selected || null);
                  setNodeInfo('');
                }}
              >
                <option value="">Seleccionar nodo</option>
                {searchResults.map((node) => (
                  <option
                    key={node.attributes.code}
                    value={node.attributes.code}
                  >
                    {node.name} ({node.attributes.code})
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedNode && (
            <>
              <Button
                className="col-span-1"
                variant="secondary"
                onClick={() => {
                  const nivel = getNodeLevel(treeData, selectedNode);
                  setNodeInfo(`Nivel del nodo: ${nivel}`);
                  console.log(
                    `Nivel del nodo ${selectedNode.name} (${selectedNode.attributes.code}, temp=${selectedNode.attributes.avegTemp.toFixed(4)}): ${nivel}`
                  );
                }}
              >
                Nivel
              </Button>

              <Button
                className="col-span-1"
                onClick={() => {
                  const padre = getParent(treeData, selectedNode);
                  setNodeInfo(
                    `Nodo padre: ${padre?.name} - ${padre?.attributes.code}`
                  );
                  formatNodeInfo(padre, 'Padre', selectedNode);
                }}
              >
                Padre
              </Button>

              <Button
                className="col-span-1"
                onClick={() => {
                  const abuelo = getGrandparent(treeData, selectedNode);
                  setNodeInfo(
                    `Nodo abuelo: ${abuelo?.name} - ${abuelo?.attributes.code}`
                  );
                  formatNodeInfo(abuelo, 'Abuelo', selectedNode);
                }}
              >
                Abuelo
              </Button>

              <Button
                className="col-span-1"
                variant="secondary"
                onClick={() => {
                  const tio = getUncle(treeData, selectedNode);
                  setNodeInfo(
                    `Nodo tio: ${tio?.name} - ${tio?.attributes.code}`
                  );
                  formatNodeInfo(tio, 'Tío', selectedNode);
                }}
              >
                Tío
              </Button>
              <Button
                className="col-span-2"
                variant="secondary"
                onClick={() => {
                  const balance = getBalance(selectedNode);
                  setNodeInfo(`Factor de balance: ${balance}`);
                  console.log(
                    `Balance del nodo ${selectedNode.name} (${selectedNode.attributes.code}, temp=${selectedNode.attributes.avegTemp.toFixed(4)}): ${balance}`
                  );
                }}
              >
                Factor de balanceo
              </Button>
              <p className="col-span-2 px-5 text-center text-xs font-bold break-words">
                {nodeInfo !== '' ? nodeInfo : '...'}
              </p>
            </>
          )}

          <Separator text="Operaciones con el arbol" />

          <Button
            onClick={() =>
              setNivelesRecorrido(levelWalkthrough(displayTreeData))
            }
            variant="primary"
            className="col-span-2"
          >
            Hacer Recorrido Por Niveles
          </Button>
          <Button
            className="col-span-2"
            onClick={() => {
              setDisplayTreeData(treeData);
              Swal.fire({
                title: 'Arbol reiniciado!',
                text: `El arbol ha sido reiniciado con los datos por defecto!`,
                icon: 'success',
                confirmButtonText: 'Okay',
              });
            }}
            variant="secondary"
          >
            Reiniciar arbol
          </Button>
          <Button
            className="col-span-2"
            variant="primary"
            onClick={() => {
              // Reiniciar el árbol a estado vacío
              const emptyTree: TreeNode = {
                name: '',
                attributes: {
                  avegTemp: 0,
                  tempStr: '',
                  code: '',
                  flag: '',
                  height: 0,
                },
                children: [{ name: '' }, { name: '' }],
              };
              setDisplayTreeData(emptyTree);
              setTreeData(emptyTree); // Actualiza el árbol
              setSearchResults([]); // Limpia resultados de búsqueda
              setSelectedNode(null); // Limpia selección de nodo

              console.log(
                'Árbol limpiado. Todos los nodos han sido eliminados.'
              );
            }}
          >
            Limpiar árbol
          </Button>

          {nivelesRecorrido.map((row, rowIndex) => (
            <div key={rowIndex} className="col-span-2 mb-4">
              <p className="text-accent font-semibold">Nivel {rowIndex}</p>
              <div className="grid grid-cols-5 items-center justify-center">
                {row.map((col, colIndex) => {
                  const iso2 = iso.whereAlpha3(col)?.alpha2?.toLowerCase();
                  return (
                    <div
                      key={colIndex}
                      className="m-2 flex items-center justify-center space-x-2"
                    >
                      <img
                        src={`https://flagcdn.com/w20/${iso2}.png`}
                        alt="Flag"
                        width={40}
                        height={40}
                      />
                      <span className="text-center text-xs font-bold break-words">
                        {col}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Visualización del árbol */}
        <DynamicAVLTree
          key={JSON.stringify(displayTreeData)}
          data={displayTreeData}
        />
      </div>
    </>
  );
}
