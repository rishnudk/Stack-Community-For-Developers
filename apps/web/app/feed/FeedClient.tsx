'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@repo/ui/card';
import { Avatar, AvatarFallback } from '@repo/ui/avatar';
import { Badge } from '@repo/ui/badge';
import { Separator } from '@repo/ui/separator';
import type { Session } from 'next-auth';
import {LeftSidebar} from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components//RightSidebar';
import {FeedBox} from './components/feedbox/FeedBox';

interface FeedClientProps {
  session: Session;
}

export default function FeedClient({ session }: FeedClientProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar session={session} />

      {/*  Center feed area */}
      <main className="flex-1 flex justify-center px-6 py-8">
        <FeedBox />
      </main>

      <RightSidebar session={session} />
    </div>
  )
}