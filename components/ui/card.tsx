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
        'rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-out hover:border-white/[0.12] hover:bg-white/[0.03]', 
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-5">
          {title ? <h3 className="text-[15px] font-medium text-white">{title}</h3> : null}
          {description ? <p className="mt-1.5 text-[13px] text-[#8A8F98] leading-relaxed">{description}</p> : null}
        </div>
      )}
      {children}
      {footer ? <div className="mt-6 border-t border-white/[0.08] pt-5">{footer}</div> : null}
    </div>
  );
}
