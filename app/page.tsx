'use client';
import Button from '@/app/ui/Button';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 text-white">
      {/* 🔹 Imagen de fondo (abajo de todo) */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/background.jpeg')" }}
      />

      {/* 🔹 Degradado semitransparente encima de la imagen */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#4F1B6E]/90 via-[#1B3942]/85 to-[#718191]/90" />

      {/* 🔹 Contenido */}
      <h1 className="z-10 mb-6 text-center text-4xl font-bold drop-shadow-lg md:text-6xl">
        Treematric
      </h1>

      <p className="z-10 mb-10 max-w-xl text-center text-[15px]">
        Herramienta interactiva que permite visualizar y analizar datos a través
        de grafos y árboles. Su diseño está orientado a representar situaciones
        específicas, como las rutas entre aeropuertos y las condiciones
        climáticas de distintos países. A partir de estas visualizaciones, el
        usuario puede explorar relaciones, patrones y comportamientos de forma
        intuitiva y dinámica.
      </p>

      <div className="z-10 flex flex-col gap-4 sm:flex-row">
        <Link href={'/airports'}>
          <Button
            onClick={() => console.log('Ir a árbol')}
            className="rounded-2xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          >
            Vuelos entre aeropuertos
          </Button>
        </Link>

        <Link href={'/tree'}>
          <Button
            onClick={() => console.log('Ir a grafos')}
            className="rounded-2xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          >
            Clima de países
          </Button>
        </Link>
      </div>
    </main>
  );
}
