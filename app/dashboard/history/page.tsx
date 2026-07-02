import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Shell } from '@/components/ui/shell';

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const items: Array<{ action: string; entity: string; createdAt: string }> = [];

  return (
    <Shell title="History" description="A timeline of your recent activity." actions={null}>
      {items.length === 0 ? (
        <EmptyState title="No recent activity" description="Your history will appear here as you start interacting with the app." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={`${item.action}-${item.entity}`} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{item.action}</p>
                <p className="text-sm text-[#A1A1AA]">{item.entity}</p>
              </div>
              <p className="text-sm text-[#A1A1AA]">{item.createdAt}</p>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  );
}
