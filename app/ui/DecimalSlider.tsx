import { useState } from 'react';

export default function DecimalSlider({
  min = 0,
  max = 10,
  step = 0.1,
  label = '',
  className = '',
}: {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}) {
  const [value, setValue] = useState((min + max) / 2);

  return (
    <div className={`${className} flex flex-col items-center gap-2`}>
      <label className="w-full text-xs font-bold">{label}</label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="accent-accent hover:bg-accent-hover h-2 w-full rounded-lg bg-gray-300 hover:cursor-pointer"
      />
      <span className="text-sm">{value.toFixed(2)}</span>
    </div>
  );
}
