'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const utils = trpc.useUtils();
  const createPost = trpc.createPost.useMutation({
    onSuccess: () => {
      toast.success('Post created successfully!');
      setTitle('');
      setContent('');
      utils.getPosts.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    createPost.mutate({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post title"
          disabled={createPost.isPending}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post content"
          disabled={createPost.isPending}
        />
      </div>

      <Button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? 'Creating...' : 'Create Post'}
      </Button>
    </form>
  );
}

