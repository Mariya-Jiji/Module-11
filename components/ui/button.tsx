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
  const base = 'inline-flex items-center justify-center rounded-full border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] disabled:cursor-not-allowed disabled:opacity-60';

  const variants: Record<ButtonVariant, string> = {
    primary: 'border-transparent bg-[#7C3AED] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_12px_30px_rgba(124,58,237,0.28)] hover:bg-[#6D28D9]',
    secondary: 'border-[#1C1C1F] bg-[#111113] text-white hover:border-[#2A2A2F] hover:bg-[#17171A]',
    ghost: 'border-transparent bg-transparent text-[#A1A1AA] hover:bg-[#111113] hover:text-white',
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
