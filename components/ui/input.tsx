import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <label className="block w-full">
      {label ? <span className="mb-2 block text-sm text-[#A1A1AA]">{label}</span> : null}
      <input
        className={cn(
          'w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-[13px] text-white outline-none transition-all duration-300 focus:border-white/30 focus:bg-white/[0.04] focus:ring-4 focus:ring-white/5 shadow-inner',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </label>
  );
}
