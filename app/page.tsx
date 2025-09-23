'use client';
import Button from '@/app/ui/Button';
import TempTree from '@/app/ui/TempTree';
import dynamic from 'next/dynamic';

const DynamicTree = dynamic(() => import('@/app/ui/TempTree'), { ssr: false });

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col gap-3 p-3 md:flex-row">
        <div className="grid w-full auto-rows-min grid-cols-3 gap-2 bg-green-900 p-3 md:w-92 md:grid-cols-2">
          <Button className="col-span-1">Agregar nodo</Button>
          <Button variant="secondary" className="col-span-2">
            Eliminar nodo
          </Button>
        </div>
        <DynamicTree />
        {/* <div className="h-220 flex-1 overflow-auto bg-red-900 p-3 md:h-auto">
          <DynamicTree />
        </div> */}
      </div>
    </>
  );
}
