'use client'

import React from 'react'
import { Card, CardContent } from '@repo/ui/card'

interface Post {
  id: string
  author: string
  content: string
  createdAt: string
}

interface PostListProps {
  posts?: Post[]
}

// Sample dummy posts
const defaultPosts: Post[] = [
  {
    id: '1',
    author: 'Dk',
    content: 'Just learned about tRPC and it’s amazing! 🚀',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    author: 'Alice',
    content: 'Working on a new React project with Next.js 15!',
    createdAt: '5 hours ago',
  },
]

export default function PostList({ posts = defaultPosts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900">{post.author}</p>
              <span className="text-xs text-gray-500">{post.createdAt}</span>
            </div>
            <p className="text-gray-700 text-sm">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
