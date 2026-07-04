import { Skeleton } from '@/components/ui/skeleton';
import { Shell } from '@/components/ui/shell';
import { Card } from '@/components/ui/card';

export default function HistoryLoading() {
  const skeletons = [
    { titleWidth: 'w-[200px]', descWidth: 'w-[300px]' },
    { titleWidth: 'w-[150px]', descWidth: 'w-[250px]' },
    { titleWidth: 'w-[220px]', descWidth: 'w-[280px]' },
    { titleWidth: 'w-[180px]', descWidth: 'w-[320px]' },
    { titleWidth: 'w-[240px]', descWidth: 'w-[270px]' },
  ];

  return (
    <Shell title="History" description="A timeline of your recent activity." actions={null}>
      <div className="space-y-3">
        {skeletons.map((skel, i) => (
          <Card key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-background">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className={`h-4 ${skel.titleWidth}`} />
                <Skeleton className={`h-3 ${skel.descWidth} opacity-70`} />
              </div>
            </div>
            <Skeleton className="h-3 w-20 shrink-0 hidden sm:block" />
          </Card>
        ))}
      </div>
    </Shell>
  );
}
