'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogOut, User as UserIcon } from 'lucide-react';

export function SettingsClient() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');

  const updateMutation = useMutation({
    mutationFn: async (newName: string) => {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: async () => {
      // Force NextAuth to re-fetch the session data so the navbar updates immediately
      await update({ name });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (name === session?.user?.name) {
      toast.success('Profile updated successfully'); // fake success if unchanged
      return;
    }
    updateMutation.mutate(name);
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-border bg-background p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-xl font-medium text-white border border-border">
            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || <UserIcon className="h-6 w-6 text-muted-foreground" />}
          </div>
          <div>
            <h2 className="text-[15px] font-medium text-white">{session?.user?.name || 'User'}</h2>
            <p className="text-[13px] text-[#8A8F98]">{session?.user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[13px] font-medium text-white">
              Display Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-md h-9 text-[13px] bg-transparent border-border focus-visible:ring-1 focus-visible:ring-neutral-700"
              placeholder="Enter your name"
            />
            <p className="text-[12px] text-[#8A8F98]">This is your public display name.</p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button 
              type="submit" 
              size="sm"
              disabled={updateMutation.isPending}
              className="h-8 px-4 text-[12px] bg-black text-white hover:bg-neutral-900 border border-border shadow-none"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-lg border border-red-900/30 bg-red-900/5 p-6">
        <h3 className="text-[14px] font-medium text-red-400">Account Access</h3>
        <p className="mt-1 text-[13px] text-[#8A8F98] mb-4">Log out of your current session on this device.</p>
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="h-8 px-4 text-[12px] text-red-400 bg-red-400/10 hover:bg-red-400/20 hover:text-red-300 border-transparent transition-colors"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Log out
        </Button>
      </div>
    </div>
  );
}
