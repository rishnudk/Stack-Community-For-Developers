'use client';

import { CreatePost } from '../components/CreatePost';
import { PostList } from '../components/PostList';
import { Card, CardHeader, CardTitle, CardDescription } from '@repo/ui/card';
import { Avatar, AvatarFallback } from '@repo/ui/avatar';
import { Badge } from '@repo/ui/badge';
import { Separator } from '@repo/ui/separator';
import type { Session } from 'next-auth';
import LeftSidebar from './components/LeftSidebar';

interface FeedClientProps {
  session: Session;
}

export function FeedClient({ session }: FeedClientProps) {
  const getUserInitials = () => {
    const name = session.user?.name || session.user?.email || 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <LeftSidebar session={session} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user?.name || 'User'}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <CardTitle className="text-2xl sm:text-3xl">
                    Welcome back, {session.user?.name ?? session.user?.email?.split('@')[0]}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {session.user?.email}
                  </CardDescription>
                  {session.user?.id && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      ID: {session.user.id.slice(0, 8)}...
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Separator />

          {/* Create Post Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Create a Post</h2>
            <CreatePost />
          </div>

          <Separator />

          {/* Posts Feed Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Your Feed</h2>
            <PostList />
          </div>
        </div>
      </main>
    </div>
  );
}