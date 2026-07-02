import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export function Card({ className, title, description, footer, children, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-3xl border border-[#1C1C1F] bg-[#111113] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]', className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-5">
          {title ? <h3 className="text-lg font-semibold text-white">{title}</h3> : null}
          {description ? <p className="mt-1 text-sm text-[#A1A1AA]">{description}</p> : null}
        </div>
      )}
      {children}
      {footer ? <div className="mt-5 border-t border-[#1C1C1F] pt-4">{footer}</div> : null}
    </div>
  );
}
