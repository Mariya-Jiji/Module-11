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
          'w-full rounded-[14px] border border-white/[0.08] bg-[#0B0B0B] px-4 py-3 text-[15px] text-white outline-none transition-all duration-200 ease focus:border-white/[0.15] focus:ring-2 focus:ring-[rgba(120,120,255,0.15)]',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </label>
  );
}
