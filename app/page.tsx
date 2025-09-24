'use client';
import Button from '@/app/ui/Button';
import dynamic from 'next/dynamic';
import Input from '@/app/ui/Input';
import Separator from '@/app/ui/Separator';
import Logo from '@/app/ui/Logo';
import DecimalSlider from '@/app/ui/DecimalSlider';

const DynamicAVLTree = dynamic(() => import('@/app/ui/AVLTree'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col gap-3 p-3 md:flex-row">
        <div className="bg-mask scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray grid w-full auto-rows-min grid-cols-4 gap-3 overflow-auto rounded p-4 md:w-92 md:grid-cols-2">
          <Logo />
          <Separator text="Inserción" />
          <Button className="col-span-4 md:col-span-2">Agregar nodo</Button>
          <Separator text="Eliminación y busqueda de nodo por metrica" />
          <Input className="col-span-2" label="Metrica" placeholder="0.001" />
          <Button className="col-span-1">Eliminar</Button>
          <Button variant="secondary" className="col-span-1">
            Buscar
          </Button>
          <Separator text="Busqueda por temperatura promedio de año" />
          <Input
            className="col-span-4 md:col-span-2"
            label="Año"
            type="number"
            placeholder="2022"
          />
          <Button className="col-span-2">Menor al promedio</Button>
          <Button variant="secondary" className="col-span-2">
            Mayor al promedio
          </Button>
          <Separator text="Configuraciones visuales" />
          <DecimalSlider
            className="col-span-2"
            label="Profundidad de los nodos"
          />
          <DecimalSlider
            className="col-span-2"
            label="Distancia entre nodos hermanos"
          />
        </div>
        <DynamicAVLTree />
      </div>
    </>
  );
}
