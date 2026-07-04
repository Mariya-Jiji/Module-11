'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Bookmark {
  id: string;
  url: string;
}

export function SaveToolButton({ tool }: { tool: { name: string; url: string } }) {
  const queryClient = useQueryClient();

  // Fetch Bookmarks (shared cache with BookmarksClient)
  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const res = await fetch('/api/bookmarks');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const existingBookmark = bookmarks.find((b) => b.url === tool.url);
  const isSaved = !!existingBookmark;

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        const res = await fetch(`/api/bookmarks/${existingBookmark.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to unsave');
      } else {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: tool.name, url: tool.url }),
        });
        if (!res.ok) throw new Error('Failed to save');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(isSaved ? 'Tool removed from bookmarks' : 'Tool saved to bookmarks');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
      className={`h-7 px-2 text-[12px] transition-colors ${
        isSaved 
          ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-400/10' 
          : 'text-[#8A8F98] hover:text-white hover:bg-neutral-800/50'
      }`}
    >
      {isSaved ? (
        <BookmarkCheck className="mr-1.5 h-3.5 w-3.5" />
      ) : (
        <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
      )}
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
}
