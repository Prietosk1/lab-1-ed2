'use client';
import Button from '@/app/ui/Button';
import dynamic from 'next/dynamic';

const DynamicAVLTree = dynamic(() => import('@/app/ui/AVLTree'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col gap-3 p-3 md:flex-row">
        <div className="bg-mask grid w-full auto-rows-min grid-cols-3 gap-3 rounded p-4 md:w-92 md:grid-cols-2">
          <Button className="col-span-1">Agregar nodo</Button>
          <Button variant="secondary" className="col-span-2">
            Eliminar nodo
          </Button>
        </div>
        <DynamicAVLTree />
      </div>
    </>
  );
}
