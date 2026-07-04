import { auth } from '@/lib/auth';
import { Shell } from '@/components/ui/shell';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default async function DiscoverPage() {
  const session = await auth();

  return (
    <Shell 
      title="Discover" 
      description="Hand-picked, featured AI tools and models."
    >
      <div className="flex flex-col mt-4 sm:mt-6">
        <EmptyState 
          title="Discovery Page Under Construction"
          description="Another team member is currently building this page."
          action={<Button variant="secondary" disabled>Coming Soon</Button>}
        />
      </div>
    </Shell>
  );
}
