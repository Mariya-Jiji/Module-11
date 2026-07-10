import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Shell } from '@/components/ui/shell';
import { formatDistanceToNow } from 'date-fns';

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  let history: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/user/history`, {
      headers: { Cookie: `auth_token=${session.token}` }
    });
    if (res.ok) history = await res.json();
  } catch (e) {
    // silently fail and show empty history
  }

  return (
    <Shell title="History" description="A timeline of your recent activity." actions={null}>
      {history.length === 0 ? (
        <EmptyState title="No recent activity" description="Your history will appear here as you start interacting with the app." />
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border bg-background">
              <div>
                <p className="font-medium text-white text-[14px]">
                  {item.action === 'CLICK_TOOL' ? 'Visited tool' : item.action}
                </p>
                <p className="text-[13px] text-[#8A8F98]">{item.entity}</p>
              </div>
              <p className="text-[12px] text-[#636871] whitespace-nowrap">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  );
}
