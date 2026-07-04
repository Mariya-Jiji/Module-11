import { auth } from '@/lib/auth';
import { Shell } from '@/components/ui/shell';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const session = await auth();

  return (
    <Shell 
      title="All Tools" 
      description="The definitive directory of the best AI tools, models, and resources."
    >
      <div className="flex flex-col mt-4 sm:mt-6">
        <EmptyState 
          title="Tools Directory Under Construction"
          description="Another team member is currently building this page."
          action={<Button variant="secondary" disabled>Coming Soon</Button>}
        />
      </div>
    </Shell>
  );
}
