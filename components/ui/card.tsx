import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export function Card({ className, title, description, footer, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-200 ease hover:-translate-y-1 hover:border-white/[0.2]', 
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-5">
          {title ? <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-[15px] text-white/70 leading-relaxed">{description}</p> : null}
        </div>
      )}
      {children}
      {footer ? <div className="mt-6 border-t border-white/[0.08] pt-5">{footer}</div> : null}
    </div>
  );
}
