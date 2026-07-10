import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { IssueList, Issue } from '@/components/ui/issue-list';

// Mock data to demonstrate the Linear-style issue view
const mockIssues: Issue[] = [
  { id: '1', identifier: 'ORB-142', title: 'Implement email verification fallback', status: 'done', tags: ['Backend', 'Auth'] },
  { id: '2', identifier: 'ORB-145', title: 'Add rate limiting to signup route', status: 'done', tags: ['Security'] },
  { id: '3', identifier: 'ORB-150', title: 'Redesign dashboard layout to match Linear specs', status: 'in-progress', priority: 'High', tags: ['Design'] },
  { id: '4', identifier: 'ORB-151', title: 'Create reusable IssueList component', status: 'in-progress', tags: ['Frontend'] },
  { id: '5', identifier: 'ORB-156', title: 'Audit database performance for cascading deletes', status: 'todo', priority: 'Medium', tags: ['Database'] },
  { id: '6', identifier: 'ORB-158', title: 'Set up cron job for token cleanup', status: 'todo', tags: ['Backend'] },
  { id: '7', identifier: 'ORB-160', title: 'Merge auth module into main AIOrbit branch', status: 'todo', priority: 'Critical', tags: ['Integration'] },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <Shell 
      title="All Issues" 
      description="View and manage all active tasks across your workspaces."
    >
      <div className="mt-4">
        <IssueList issues={mockIssues} />
      </div>
    </Shell>
  );
}
