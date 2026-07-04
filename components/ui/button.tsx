import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl border font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#060606] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

  const variants: Record<ButtonVariant, string> = {
    primary: 'border-white/20 bg-black text-white shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset] hover:bg-[#111111] hover:border-white/30',
    secondary: 'border-white/5 bg-black text-[#A1A1AA] hover:text-white hover:bg-[#111111] hover:border-white/10',
    ghost: 'border-transparent bg-transparent text-[#A1A1AA] hover:bg-black hover:text-white',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
