import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({ label, items, value, onChange, className }: DropdownProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handle = () => setOpen(false);
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, [open]);

  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex w-full items-center justify-between rounded-2xl border border-[#1C1C1F] bg-[#111113] px-4 py-3 text-left text-sm text-white"
      >
        <span>{label}: {items.find((item) => item.value === value)?.label ?? value}</span>
        <span className="text-[#A1A1AA]">▾</span>
      </button>

      {open ? (
        <div className="absolute z-10 mt-2 w-full rounded-2xl border border-[#1C1C1F] bg-[#111113] p-2 shadow-xl shadow-black/40">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center rounded-xl px-3 py-2 text-sm text-left transition',
                value === item.value ? 'bg-violet-600/20 text-white' : 'text-[#A1A1AA] hover:bg-[#17171A] hover:text-white',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
