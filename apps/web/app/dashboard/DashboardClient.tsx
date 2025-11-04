'use client';

import { signOut } from 'next-auth/react';
import { CreatePost } from '../components/CreatePost';
import { PostsFeed } from '../components/PostsFeed';
import { Button } from '@repo/ui/button';
import Link from 'next/link';
import type { Session } from 'next-auth';

interface DashboardClientProps {
  session: Session;
}

export function DashboardClient({ session }: DashboardClientProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {session.user?.name ?? session.user?.email}
              </h1>
              <p className="text-gray-600">{session.user?.email}</p>
              {session.user?.id && (
                <p className="text-sm text-gray-500">ID: {session.user.id}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/profile">
              <Button>Profile</Button>
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Posts List */}
      <PostsFeed currentUserId={session.user?.id || ''} />
    </div>
  );
}

