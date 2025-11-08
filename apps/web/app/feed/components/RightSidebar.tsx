'use client'

import React from 'react'
import type { Session } from 'next-auth'
import { Search, Hash, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@repo/ui/card'
import { Button } from '@repo/ui/button'
import Link from 'next/link'

interface RightSidebarProps {
  session: Session
}

export default function RightSidebar({ session }: RightSidebarProps) {
  // Mock data (replace with tRPC/Prisma later)
  const trendingTopics = [
    { tag: '#javascript', posts: 1324 },
    { tag: '#react', posts: 982 },
    { tag: '#nextjs', posts: 774 },
    { tag: '#typescript', posts: 615 },
    { tag: '#mongodb', posts: 430 },
  ]

  const followSuggestions = [
    { name: 'Alice Johnson', role: 'Frontend Developer' },
    { name: 'John Smith', role: 'Full Stack Engineer' },
    { name: 'Sarah Chen', role: 'UI/UX Designer' },
  ]

  return (
    <aside className="w-80 min-h-screen border-l border-gray-200 bg-white p-4 hidden lg:flex flex-col justify-between">
      <div>
        {/* 🔍 Search Box */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search posts or users"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* 🔥 Trending Topics */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Trending
            </h3>
            <ul className="space-y-2">
              {trendingTopics.map((topic) => (
                <li key={topic.tag} className="flex justify-between text-sm">
                  <span className="text-gray-800 hover:text-blue-600 cursor-pointer">
                    {topic.tag}
                  </span>
                  <span className="text-gray-500">{topic.posts} posts</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 👥 Follow Suggestions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Who to follow
            </h3>
            <ul className="space-y-3">
              {followSuggestions.map((user) => (
                <li
                  key={user.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <Button  variant="primary">
                    Follow
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ⚖️ Footer Links */}
      <div className="text-xs text-gray-500 space-x-3 mt-6 flex flex-wrap justify-center border-t pt-4">
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/cookies" className="hover:underline">Cookies</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </div>
    </aside>
  )
}
