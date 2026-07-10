import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-start gap-3">
        <div className="rounded-full border border-[#1C1C1F] bg-[#0B0B0C] px-3 py-1 text-sm text-[#A1A1AA]">No items yet</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#A1A1AA]">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Card>
  );
}
