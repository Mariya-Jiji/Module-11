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
    primary: 'border-white/10 bg-gradient-to-b from-white to-[#E2E2E2] text-black shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset] hover:from-white hover:to-white hover:shadow-[0_1px_4px_rgba(255,255,255,0.2)_inset,0_0_15px_rgba(255,255,255,0.1)]',
    secondary: 'border-white/5 bg-white/[0.03] text-[#A1A1AA] hover:text-white hover:bg-white/[0.08] hover:border-white/10 backdrop-blur-sm',
    ghost: 'border-transparent bg-transparent text-[#A1A1AA] hover:bg-white/5 hover:text-white',
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
