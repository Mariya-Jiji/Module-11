import { Skeleton } from '@/components/ui/skeleton';
import { Shell } from '@/components/ui/shell';

export default function DashboardLoading() {
  return (
    <Shell 
      title="Loading..." 
      description="Fetching your workspace data."
    >
      <div className="mt-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    </Shell>
  );
}
