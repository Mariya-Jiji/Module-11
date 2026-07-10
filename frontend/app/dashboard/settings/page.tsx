import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { SettingsClient } from '@/components/settings-client';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  let connectedProviders: string[] = [];
  let hasPassword = true;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/user/settings`, {
      headers: { Cookie: `auth_token=${session.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      connectedProviders = data.connectedProviders || [];
      hasPassword = data.hasPassword ?? true;
    }
  } catch (e) {
    // fail silently
  }

  return (
    <Shell 
      title="Settings" 
      description="Manage your account profile and preferences."
    >
      <div className="mt-4">
        <SettingsClient 
          connectedProviders={connectedProviders} 
          hasPassword={hasPassword} 
        />
      </div>
    </Shell>
  );
}
