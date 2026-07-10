import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { SavedToolsClient } from '@/components/saved-tools-client';

export default async function SavedToolsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  return (
    <Shell title="Saved Tools" description="Keep your favorite tools and workflows close at hand.">
      <SavedToolsClient />
    </Shell>
  );
}
