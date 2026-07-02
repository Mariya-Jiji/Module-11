import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shell } from '@/components/ui/shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function ToolsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  // Fetch real tools from the database if they exist, otherwise provide rich mock data
  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const displayTools = tools.length > 0 ? tools : [
    {
      id: '1',
      name: 'ChatGPT',
      description: 'The most advanced conversational AI model by OpenAI. Capable of generating text, code, and analyzing data at a human level.',
      url: 'https://chat.openai.com',
      category: 'Text Generation',
      tags: 'ai, LLM, text, writing',
    },
    {
      id: '2',
      name: 'Midjourney',
      description: 'An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species through image generation.',
      url: 'https://midjourney.com',
      category: 'Image Generation',
      tags: 'ai, image, art, design',
    },
    {
      id: '3',
      name: 'GitHub Copilot',
      description: 'Your AI pair programmer. Uses the OpenAI Codex to suggest code and entire functions in real-time right from your editor.',
      url: 'https://github.com/features/copilot',
      category: 'Developer Tools',
      tags: 'coding, productivity, copilot',
    },
    {
      id: '4',
      name: 'ElevenLabs',
      description: 'The most realistic and versatile AI speech software, ever. Bring the most compelling, rich and lifelike voices to your creators and publishers.',
      url: 'https://elevenlabs.io',
      category: 'Audio & Voice',
      tags: 'voice, tts, cloning',
    },
    {
      id: '5',
      name: 'Perplexity AI',
      description: 'Unlock the power of knowledge with information discovery and sharing using natural language search capabilities.',
      url: 'https://perplexity.ai',
      category: 'Search Engine',
      tags: 'search, research, citations',
    }
  ];

  return (
    <Shell 
      title="All Tools" 
      description="The definitive directory of the best AI tools, models, and resources."
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="h-8 text-xs bg-transparent border-border hover:bg-neutral-800/50 text-[#8A8F98] hover:text-white">Filter</Button>
          <Button variant="secondary" size="sm" className="h-8 text-xs bg-transparent border-border hover:bg-neutral-800/50 text-[#8A8F98] hover:text-white">Sort: Newest</Button>
        </div>
      }
    >
      <div className="flex flex-col border-t border-border mt-4">
        {displayTools.map((tool) => (
          <div 
            key={tool.id} 
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border py-4 px-2 transition-colors hover:bg-neutral-800/20"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-[14px] font-medium text-white">{tool.name}</h3>
                <Badge variant="secondary" className="text-[10px] bg-transparent border-border text-[#8A8F98] group-hover:text-[#EFEFEF] transition-colors">{tool.category}</Badge>
              </div>
              
              <p className="text-[13px] text-[#8A8F98] line-clamp-1 max-w-3xl pr-4">
                {tool.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                {tool.tags.split(',').slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[11px] text-[#636871]">
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[12px] text-[#8A8F98] hover:text-white hover:bg-neutral-800/50">
                  <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#8A8F98] hover:text-white hover:bg-neutral-800/50" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
