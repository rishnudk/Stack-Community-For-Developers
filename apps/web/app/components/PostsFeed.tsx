'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';
import { LikeButton } from './LikeButton';
import { CommentsSection } from './CommentsSection';

interface PostsFeedProps {
  currentUserId: string;
}

export function PostsFeed({ currentUserId }: PostsFeedProps) {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const take = 10;

  const { data, isLoading, isFetching, refetch } = trpc.getPosts.useQuery({
    search: search.trim() || undefined,
    skip: page * take,
    take,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    refetch();
  };

  if (isLoading) return <div className="p-4">Loading posts...</div>;

  const posts = data || [];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={isFetching}>Search</Button>
      </form>

      {posts.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow-md text-center text-gray-500">
          No posts found.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const likeCount = post._count?.likes ?? post.likes?.length ?? 0;
            const likedByMe = (post.likes || []).some((l: { userId: string }) => l.userId === currentUserId);
            return (
              <div key={post.id} className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                    <div className="text-sm text-gray-500 mb-4">
                      by {post.author?.name || post.author?.email}
                      <span className="ml-2">• {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

                <div className="flex items-center gap-4 mb-4">
                  <LikeButton
                    postId={post.id}
                    initialCount={likeCount}
                    initiallyLiked={likedByMe}
                  />
                  <div className="text-sm text-gray-500">
                    {post._count?.comments ?? 0} comments
                  </div>
                </div>

                <CommentsSection postId={post.id} currentUserId={currentUserId} />
              </div>
            );
          })}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isFetching}
            >
              Previous
            </Button>
            <div className="text-sm text-gray-600">Page {page + 1}</div>
            <Button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={posts.length < take || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
