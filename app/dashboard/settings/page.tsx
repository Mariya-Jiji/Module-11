import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { SettingsClient } from '@/components/settings-client';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <Shell 
      title="Settings" 
      description="Manage your account profile and preferences."
    >
      <div className="mt-4">
        <SettingsClient />
      </div>
    </Shell>
  );
}
