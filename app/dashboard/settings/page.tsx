import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { SettingsClient } from '@/components/settings-client';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { accounts: true },
  });

  const connectedProviders = user?.accounts.map((acc) => acc.provider) || [];
  const hasPassword = !!user?.password;

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
