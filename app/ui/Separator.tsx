export default function Separator({ text = '' }: { text?: string }) {
  return (
    <div className="col-span-4 mt-3 mb-0 flex w-full items-center md:col-span-2">
      <div className="bg-mask h-px w-full grow" />
      <p className="mx-2 max-w-[70%] shrink-0 text-center text-sm font-semibold break-words">
        {text}
      </p>
      <div className="bg-mask h-px w-full grow" />
    </div>
  );
}
