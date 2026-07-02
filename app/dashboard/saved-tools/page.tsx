import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Shell } from '@/components/ui/shell';

export default async function SavedToolsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const items: Array<{ name: string; category: string; description: string }> = [];

  return (
    <Shell title="Saved Tools" description="Keep your favorite tools and workflows close at hand." actions={<Button>Save tool</Button>}>
      {items.length === 0 ? (
        <EmptyState title="No saved tools yet" description="Save tools you use often to keep your workspace focused." action={<Button variant="secondary">Discover tools</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.name} title={item.name} description={item.description}>
              <div className="flex items-center justify-between text-sm text-[#A1A1AA]">
                <span>{item.category}</span>
                <Button variant="ghost" size="sm">Open</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  );
}
