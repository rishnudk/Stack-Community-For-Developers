'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

interface CommentsSectionProps {
  postId: string;
  currentUserId: string;
}

export function CommentsSection({ postId, currentUserId }: CommentsSectionProps) {
  const [content, setContent] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingContent, setEditingContent] = React.useState('');

  const utils = trpc.useUtils();
  const { data: comments, isLoading } = trpc.getComments.useQuery({ postId });

  const createComment = trpc.createComment.useMutation({
    onSuccess: () => {
      setContent('');
      utils.getComments.invalidate({ postId });
    },
    onError: (e) => toast.error(e.message || 'Failed to add comment'),
  });

  const editComment = trpc.editComment.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setEditingContent('');
      utils.getComments.invalidate({ postId });
    },
    onError: (e) => toast.error(e.message || 'Failed to edit comment'),
  });

  const deleteComment = trpc.deleteComment.useMutation({
    onSuccess: () => {
      utils.getComments.invalidate({ postId });
    },
    onError: (e) => toast.error(e.message || 'Failed to delete comment'),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate({ postId, content: content.trim() });
  };

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditingContent(current);
  };

  const saveEdit = () => {
    if (!editingId || !editingContent.trim()) return;
    editComment.mutate({ id: editingId, content: editingContent.trim() });
  };

  const remove = (id: string) => {
    if (confirm('Delete this comment?')) deleteComment.mutate({ id });
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading comments...</div>
      ) : !comments || comments.length === 0 ? (
        <div className="text-sm text-gray-500">No comments yet.</div>
      ) : (
        <div className="space-y-3 mb-3">
          {comments.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded p-3">
              <div className="text-sm text-gray-600 mb-1">
                {c.author?.name || c.author?.email} • {new Date(c.createdAt).toLocaleString()}
              </div>
              {editingId === c.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <div className="flex gap-2">
                    <Button type="button" onClick={saveEdit} disabled={editComment.isPending}>
                      Save
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="whitespace-pre-wrap">{c.content}</p>
                  {c.authorId === currentUserId && (
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => startEdit(c.id, c.content)}>
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => remove(c.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-2">
        <textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <div>
          <Button type="submit" disabled={createComment.isPending}>
            {createComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
