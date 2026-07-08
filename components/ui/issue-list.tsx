'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Circle, CheckCircle2, ChevronRight } from 'lucide-react';

export type IssueStatus = 'todo' | 'in-progress' | 'done';

export interface Issue {
  id: string;
  identifier: string; // e.g., "AI-14"
  title: string;
  status: IssueStatus;
  priority?: string;
  tags?: string[];
}

interface IssueListProps {
  issues: Issue[];
}

export function IssueList({ issues }: IssueListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-[14px] w-[14px] text-[#8a8f98] shrink-0 translate-y-[2px]" strokeWidth={2} />;
      case 'in-progress':
        // Linear uses a half-filled circle, we'll simulate with an SVG or just use a distinct color on the circle
        return (
          <svg className="h-[14px] w-[14px] shrink-0 translate-y-[2px] text-[#5e6ad2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'done':
        return <CheckCircle2 className="h-[14px] w-[14px] text-[#42d17c] shrink-0 translate-y-[2px]" strokeWidth={2} />;
    }
  };

  return (
    <div className="w-full flex flex-col border border-white/[0.06] rounded-lg overflow-hidden bg-[#0d0d0d]">
      {issues.map((issue, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={issue.id}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' && index < issues.length - 1) setActiveIndex(index + 1);
              if (e.key === 'ArrowUp' && index > 0) setActiveIndex(index - 1);
            }}
            className={cn(
              "group relative flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-2.5 text-left outline-none transition-all duration-150 ease-out active:scale-[0.99] active:duration-75 last:border-0",
              isActive ? "bg-[#1c1c1f]" : "hover:bg-[#161618]",
              "focus-visible:ring-1 focus-visible:ring-[#5e6ad2]/50 focus-visible:z-10"
            )}
          >
            {/* Left Accent Bar for Active State */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#5e6ad2]" />
            )}

            <div className="flex items-start shrink-0">
              {getStatusIcon(issue.status)}
              <span className="ml-3 w-12 text-[12px] font-medium text-[#8a8f98] translate-y-[1px]">{issue.identifier}</span>
            </div>
            
            <div className="flex flex-1 items-start justify-between min-w-0">
              <span className="truncate text-[14px] font-medium text-[#e8e8e8] group-hover:text-white transition-colors">{issue.title}</span>
              
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {issue.tags?.map(tag => (
                  <span key={tag} className="inline-flex items-center rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-[#a1a1aa] group-hover:text-[#c4c4c4] transition-colors">
                    {tag}
                  </span>
                ))}
                {issue.priority && (
                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-[#8a8f98]">
                    {issue.priority}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
