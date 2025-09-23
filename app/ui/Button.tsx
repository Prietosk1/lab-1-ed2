// La interfaz va a definir si el boton es primario o secundario
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  // Dependiendo del variant, aplicamos diferentes clases
  const variantClasses =
    variant === 'primary'
      ? 'bg-accent text-foreground hover:bg-accent-hover hover:scale-[1.02]'
      : 'bg-secondary text-accent hover:bg-secondary-hover';
  return (
    <button
      className={`cursor-pointer rounded px-4 py-2 font-sans text-sm font-bold transition-all duration-200 ease-in hover:scale-103 ${variantClasses} ${className}`}
      {...props}
    />
  );
}
