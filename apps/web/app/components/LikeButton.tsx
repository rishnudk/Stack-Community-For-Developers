'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initiallyLiked: boolean;
}

export function LikeButton({ postId, initialCount, initiallyLiked }: LikeButtonProps) {
  const [liked, setLiked] = React.useState(initiallyLiked);
  const [count, setCount] = React.useState(initialCount);

  const toggleLike = trpc.toggleLike.useMutation({
    onSuccess: (res) => {
      setLiked(res.liked);
      setCount((c) => (res.liked ? c + 1 : Math.max(0, c - 1)));
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to toggle like');
    },
  });

  const handleClick = () => {
    if (toggleLike.isPending) return;
    toggleLike.mutate({ postId });
  };

  return (
    <Button type="button" onClick={handleClick} disabled={toggleLike.isPending}>
      {liked ? 'Unlike' : 'Like'} • {count}
    </Button>
  );
}
