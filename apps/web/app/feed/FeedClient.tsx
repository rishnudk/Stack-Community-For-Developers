'use client';

import CreatePostBox from './components/CreatePostBox';
import PostList from './components/PostList';
import { Card, CardHeader, CardTitle, CardDescription } from '@repo/ui/card';
import { Avatar, AvatarFallback } from '@repo/ui/avatar';
import { Badge } from '@repo/ui/badge';
import { Separator } from '@repo/ui/separator';
import type { Session } from 'next-auth';
import LeftSidebar from './components/LeftSidebar';
import Sidebar from './components/sidebar/Sidebar';
import RightSidebar from './components/RightSidebar';
import PostCard from './components/PostCard';
import Navigation from './components/Navigation';
import FeedBox from './components/FeedBox';

interface FeedClientProps {
  session: Session;
}

export default function FeedClient({ session }: FeedClientProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar session={session} />

      {/*  Center feed area */}
      <main className="flex-1 flex justify-center px-6 py-8">
        <FeedBox />
      </main>

      <RightSidebar session={session} />
    </div>
  )
}