import { Card } from '@/components/ui/card';

interface StateCardProps {
  title: string;
  description: string;
  tone?: 'default' | 'error' | 'success';
}

export function StateCard({ title, description, tone = 'default' }: StateCardProps) {
  const toneClasses = {
    default: 'border-[#1C1C1F] bg-[#111113]',
    error: 'border-red-500/30 bg-red-500/10',
    success: 'border-emerald-500/30 bg-emerald-500/10',
  };

  return (
    <Card className={toneClasses[tone]}>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-[#A1A1AA]">{description}</p>
    </Card>
  );
}
