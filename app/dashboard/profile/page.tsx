import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { ProfileClient } from '@/components/profile-client';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <Shell 
      title="Profile" 
      description="Manage your display name and public identity."
    >
      <div className="mt-4">
        <ProfileClient />
      </div>
    </Shell>
  );
}
