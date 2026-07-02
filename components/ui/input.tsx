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
          'w-full rounded-2xl border border-[#1C1C1F] bg-[#111113] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20',
          error && 'border-red-500/60',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </label>
  );
}
