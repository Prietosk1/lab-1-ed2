import Image from 'next/image';

export default function Logo() {
  return (
    <div className="col-span-4 flex items-center justify-center gap-2 md:col-span-2 md:justify-normal">
      <Image
        src="/globe.svg"
        alt="Treematic logo"
        width={30}
        height={30}
        color="green"
      />
      <h1 className="text-3xl font-bold">
        <span className="text-accent">Tree</span>{' '}
        <span className="decoration-mask underline decoration-wavy underline-offset-4">
          m a t r i c
        </span>
      </h1>
    </div>
  );
}
