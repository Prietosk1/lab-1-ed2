import { useEffect, useRef, useState } from 'react';
import Tree, { PathFunction, RawNodeDatum, TreeLinkDatum } from 'react-d3-tree';
import generateTreeData from '@/app/scripts/generateTreeData';
import { TreeNode } from '@/app/types/treeNode';
import CustomNode from './CustomNode';

const treeExample: TreeNode = {
  name: 'Root',
  attributes: { temp: 0.001, tempStr: 'N/A', code: 'N/A', flag: '', height: 2 },
  children: [
    { name: '' },
    {
      name: 'Child 2',
      attributes: {
        temp: 0.002,
        tempStr: 'N/A',
        code: 'N/A',
        flag: 'https://flagcdn.com/w20/af.png',
        height: 1,
      },
      children: [{ name: '' }, { name: '' }],
    },
  ],
};

export default function AVLTree() {
  const containerRef = useRef<HTMLDivElement>(null); // Ref para el contenedor del árbol
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Dimensiones del contenedor
  const [treeData, setTreeData] = useState<TreeNode>(generateTreeData()); // Datos del árbol
  // const [treeData, setTreeData] = useState<TreeNode>(treeExample); // Datos del árbol de prueba

  //
  const linkClass: PathFunction = ({ target }: TreeLinkDatum) => {
    if (target.data.name === '') {
      return 'link__to-empty';
    }
    return 'link__default';
  };

  // Medir contenedor
  useEffect(() => {
    // Asegurarse de que el ref no sea nulo
    if (!containerRef.current) {
      console.warn('Container ref is null');
      return;
    }

    // Usar ResizeObserver para detectar cambios en el tamaño del contenedor siempre que se redimensione la ventana del navegador
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-foreground basis-full overflow-auto rounded p-3 md:h-auto md:flex-1 md:basis-0"
    >
      <Tree
        data={treeData as RawNodeDatum}
        orientation="vertical"
        translate={{
          x: dimensions.width / 2, // centra horizontalmente
          y: dimensions.height / 4, // centra verticalmente
        }}
        dimensions={dimensions}
        collapsible={false}
        zoom={0.1}
        nodeSize={{ x: 150, y: 100 }}
        pathFunc={'straight'}
        renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} />}
        pathClassFunc={linkClass}
        separation={{ siblings: 1, nonSiblings: 1 }}
        depthFactor={600}
      />
    </div>
  );
}
