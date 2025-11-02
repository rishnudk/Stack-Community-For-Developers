'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Session } from 'next-auth';

interface ProfileClientProps {
  session: Session;
}

export function ProfileClient({ session }: ProfileClientProps) {
  const { data: user, isLoading } = trpc.getCurrentUser.useQuery();
  const updateProfile = trpc.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      name: name.trim() || undefined,
      image: image.trim() || undefined,
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email (read-only)
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || session.user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              disabled={updateProfile.isPending}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL"
              disabled={updateProfile.isPending}
            />
            {image && (
              <img
                src={image}
                alt="Profile preview"
                className="mt-2 w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}

