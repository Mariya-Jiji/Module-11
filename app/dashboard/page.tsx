import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shell } from '@/components/ui/shell';
import { Bookmark, PenTool, Activity, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <Shell title="Overview" description="Your daily workspace snapshot." actions={<Button variant="secondary">Export data</Button>}>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card title="Quick Stats" description="Your active data over the last 30 days.">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-2xl border border-[#1C1C1F] bg-[#0B0B0C] p-4 flex flex-col items-start justify-center">
                <Bookmark className="mb-2 h-5 w-5 text-violet-400" />
                <p className="text-sm text-[#A1A1AA]">Bookmarks</p>
                <p className="mt-1 text-2xl font-semibold text-white">24</p>
              </div>
              <div className="rounded-2xl border border-[#1C1C1F] bg-[#0B0B0C] p-4 flex flex-col items-start justify-center">
                <PenTool className="mb-2 h-5 w-5 text-emerald-400" />
                <p className="text-sm text-[#A1A1AA]">Saved tools</p>
                <p className="mt-1 text-2xl font-semibold text-white">8</p>
              </div>
              <div className="rounded-2xl border border-[#1C1C1F] bg-[#0B0B0C] p-4 flex flex-col items-start justify-center">
                <Activity className="mb-2 h-5 w-5 text-blue-400" />
                <p className="text-sm text-[#A1A1AA]">History</p>
                <p className="mt-1 text-2xl font-semibold text-white">146</p>
              </div>
            </div>
          </Card>
          
          <Card title="Placeholder for Future Features" description="Coming soon to your workspace.">
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#1C1C1F] bg-[#111113]/50">
              <p className="text-sm text-[#A1A1AA]">Analytics module unlocked in v2.0</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Account" description="Your profile details.">
            <div className="space-y-3 text-sm text-[#A1A1AA]">
              <p><span className="text-white">Name:</span> {session.user.name || 'Unknown user'}</p>
              <p><span className="text-white">Email:</span> {session.user.email}</p>
              <p className="flex items-center gap-2">
                <span className="text-white">Status:</span> 
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">Active</span>
              </p>
            </div>
          </Card>

          <Card title="Recent Activity" description="Your latest interactions.">
            <div className="space-y-4">
              {[
                'Saved "ChatGPT Advanced Voice Prompt"',
                'Bookmarked "Linear UI Inspiration"',
                'Created new workspace',
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[#1C1C1F] pb-3 last:border-0 last:pb-0">
                  <p className="text-sm text-[#A1A1AA]">{activity}</p>
                  <ArrowRight className="h-4 w-4 text-[#A1A1AA]/50" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
