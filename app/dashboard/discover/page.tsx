import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, ExternalLink, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function DiscoverPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  // Fetch featured tools from the database
  const tools = await prisma.tool.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
  });

  const featuredTools = tools.length > 0 ? tools : [
    {
      id: '1',
      name: 'Vercel v0',
      description: 'Generate UI with simple text prompts. Built by Vercel on top of ShadCN and Tailwind CSS.',
      url: 'https://v0.dev',
      category: 'UI Generation',
      tags: 'ai, ui, react, nextjs',
    },
    {
      id: '2',
      name: 'Cursor',
      description: 'The AI-first code editor. Built to make you extraordinarily productive, Cursor is the best way to code with AI.',
      url: 'https://cursor.com',
      category: 'Code Editor',
      tags: 'ai, editor, copilot',
    },
    {
      id: '3',
      name: 'Runway Gen-3',
      description: 'A new standard for video generation. Unprecedented fidelity, consistency, and motion for text-to-video.',
      url: 'https://runwayml.com',
      category: 'Video Generation',
      tags: 'ai, video, creative',
    },
    {
      id: '4',
      name: 'Claude 3.5 Sonnet',
      description: 'Anthropic’s most intelligent model yet. Outperforms competitor models on a wide range of tasks.',
      url: 'https://anthropic.com/claude',
      category: 'LLM',
      tags: 'ai, claude, reasoning',
    }
  ];

  return (
    <Shell 
      title="Discover" 
      description="Hand-picked, featured AI tools and models."
      actions={
        <Button variant="secondary" size="sm" className="h-8 text-xs bg-transparent border-border hover:bg-neutral-800/50 text-[#8A8F98] hover:text-white">
          <Sparkles className="mr-2 h-3.5 w-3.5 text-[#8A8F98]" />
          Suggest a tool
        </Button>
      }
    >
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {featuredTools.map((tool) => (
          <div 
            key={tool.id} 
            className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-background p-5 transition-colors hover:border-neutral-700 hover:bg-neutral-900/30"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#111113] border border-border group-hover:border-neutral-700 transition-colors">
                  <span className="text-[15px] font-semibold text-white">{tool.name.charAt(0)}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-transparent border-border text-[#8A8F98] group-hover:text-[#EFEFEF] transition-colors shrink-0">{tool.category}</Badge>
              </div>
              
              <h3 className="mt-4 text-[15px] font-medium text-white">{tool.name}</h3>
              <p className="mt-1.5 text-[13px] text-[#8A8F98] line-clamp-3 leading-relaxed">
                {tool.description}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.tags.split(',').slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[11px] text-[#636871]">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-7 px-2 -ml-2 text-[12px] text-[#8A8F98] hover:text-white hover:bg-neutral-800/50">
                <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#8A8F98] transition-colors hover:bg-neutral-800/50 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
