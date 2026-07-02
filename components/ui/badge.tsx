import { cn } from "@/lib/utils"

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-2 focus:ring-offset-[#0B0B0C]";
  
  const variants: Record<BadgeVariant, string> = {
    default: "border-transparent bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-900/20",
    secondary: "border-border bg-card text-muted-foreground hover:bg-neutral-800 hover:text-white",
    destructive: "border-transparent bg-red-900/50 text-red-400 hover:bg-red-900/80",
    outline: "text-foreground border-border",
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props} />
  )
}
