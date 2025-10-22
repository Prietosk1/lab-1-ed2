'use client';
import Button from '@/app/ui/Button';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-6 text-center text-4xl font-bold md:text-6xl">
        Treematric
      </h1>

      <p className="mb-10 max-w-xl text-center">
        Texto de placeholder. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Provident laudantium minus, ad, at repellat tempora nesciunt,
        sequi quae rem quo beatae quidem consequuntur doloremque officiis ipsum
        magnam repudiandae soluta. Tempora.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href={'/airports'}>
          <Button onClick={() => console.log('Ir a árbol')}>
            Vuelos entre aeropuertos
          </Button>
        </Link>
        <Link href={'/tree'}>
          <Button
            variant="secondary"
            onClick={() => console.log('Ir a grafos')}
          >
            Clima de paises
          </Button>
        </Link>
      </div>
    </main>
  );
}
