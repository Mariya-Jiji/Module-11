'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

export function SettingsClient({ 
  connectedProviders = [], 
  hasPassword = false 
}: { 
  connectedProviders?: string[];
  hasPassword?: boolean;
}) {
  const { user, update } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const updateMutation = useMutation({
    mutationFn: async ({ newName, newImage }: { newName: string; newImage: string }) => {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, image: newImage }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: async () => {
      await update({ name, image });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      return data;
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (name === user?.name && image === (user?.image || '')) {
      toast.success('Profile updated successfully');
      return;
    }
    updateMutation.mutate({ newName: name, newImage: image });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    passwordMutation.mutate();
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Section */}
      <div className="rounded-lg border border-border bg-background p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-xl font-medium text-white border border-border overflow-hidden">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0) || user?.email?.charAt(0) || <UserIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-[15px] font-medium text-white">{user?.name || 'User'}</h2>
            <p className="text-[13px] text-[#8A8F98]">{user?.email}</p>
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

          <div className="space-y-2">
            <label htmlFor="image" className="text-[13px] font-medium text-white">
              Avatar URL
            </label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="max-w-md h-9 text-[13px] bg-transparent border-border focus-visible:ring-1 focus-visible:ring-neutral-700"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-[12px] text-[#8A8F98]">A direct link to an image to use as your avatar.</p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button 
              type="submit" 
              size="sm"
              disabled={updateMutation.isPending}
              className="h-8 px-4 text-[12px] bg-black text-white hover:bg-neutral-900 border border-border shadow-none"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save profile changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Connected Accounts Section */}
      {connectedProviders.length > 0 && (
        <div className="rounded-lg border border-border bg-background p-6">
          <h3 className="text-[14px] font-medium text-white">Connected Accounts</h3>
          <p className="mt-1 text-[13px] text-[#8A8F98] mb-4">You have connected the following social accounts for login.</p>
          <div className="flex flex-col gap-2">
            {connectedProviders.map((provider) => (
              <div key={provider} className="flex items-center justify-between p-3 border border-border rounded-md bg-neutral-900/30">
                <span className="text-[13px] text-white capitalize">{provider}</span>
                <span className="text-[11px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">Connected</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Section */}
      {hasPassword && (
        <div className="rounded-lg border border-border bg-background p-6">
          <h3 className="text-[14px] font-medium text-white">Change Password</h3>
          <p className="mt-1 text-[13px] text-[#8A8F98] mb-6">Update your account password.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-[13px] font-medium text-white">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="max-w-md h-9 text-[13px] bg-transparent border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-[13px] font-medium text-white">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="max-w-md h-9 text-[13px] bg-transparent border-border"
                required
                minLength={6}
              />
            </div>
            <div className="pt-2">
              <Button 
                type="submit" 
                size="sm"
                disabled={passwordMutation.isPending}
                className="h-8 px-4 text-[12px] bg-white text-black hover:bg-neutral-200"
              >
                {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Account Access (Logout) */}
      <div className="rounded-lg border border-red-900/30 bg-red-900/5 p-6">
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
