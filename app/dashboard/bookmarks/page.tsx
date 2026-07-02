import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { BookmarksClient } from '@/components/bookmarks-client';

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  return (
    <Shell title="Bookmarks" description="Organize important links in one place.">
      <BookmarksClient />
    </Shell>
  );
}
