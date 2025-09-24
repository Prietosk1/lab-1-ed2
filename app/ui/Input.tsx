import { HTMLInputTypeAttribute, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: HTMLInputTypeAttribute;
}

export default function Input({
  label,
  className = '',
  placeholder = '...',
  type = 'text',
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const variantClasses = focused
    ? 'bg-background border-accent'
    : 'bg-mask border-secondary-hover';
  return (
    <div className={`flex flex-col gap-1 ${className} pb-1`}>
      <label className="text-xs font-bold">{label}</label>
      <input
        className={`${variantClasses} ${className} hover:border-accent w-full rounded border p-2 text-xs font-bold transition-all duration-150 ease-in outline-none`}
        type={type}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== '' ? true : false)}
        placeholder={placeholder}
      />
    </div>
  );
}
