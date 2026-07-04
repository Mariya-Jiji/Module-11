'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Compass, Bookmark, Clock, Settings, Search, Menu, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

interface ShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

const navItems = [
  { href: '/', label: 'Tools', icon: LayoutDashboard },
  { href: '/dashboard/discover', label: 'Discover', icon: Compass },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/dashboard/history', label: 'History', icon: Clock },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Shell({ children, title, description, actions }: ShellProps) {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-background selection:bg-violet-500/30">
      {/* Fixed Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-14 shrink-0 items-center px-6">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-white font-bold text-black text-[10px]">
            S
          </div>
          <span className="ml-3 text-sm font-medium tracking-tight text-white">The AI Signal</span>
        </div>

        <nav className="flex-1 space-y-[2px] px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-neutral-800/40 text-white'
                    : 'text-[#8A8F98] hover:bg-neutral-800/20 hover:text-[#EFEFEF]'
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-[#8A8F98] group-hover:text-[#EFEFEF]")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="border-t border-border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-white overflow-hidden">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user.name?.charAt(0) || user.email?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-[13px] font-medium text-white">{user.name || 'User'}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start h-8 px-2 text-[12px] text-[#8A8F98] hover:text-white hover:bg-neutral-800/20"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Log out
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="secondary" size="icon" className="shrink-0 rounded-full">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 font-bold text-white shadow-lg shadow-violet-900/20">
              S
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-between lg:justify-end gap-4">
            <div className="relative w-full max-w-md hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools, categories, tags..."
                className="h-9 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
            {!user && (
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/auth/signin" className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-white">
                  Login
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" variant="secondary" className="h-8 rounded-full px-4 text-[13px] font-medium shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {(title || description || actions) && (
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                {title && <h1 className="text-2xl font-semibold text-white tracking-tight">{title}</h1>}
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
