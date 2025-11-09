'use client'

import React from 'react'
import Navigation from './Navigation'
import CreatePostBox from './CreatePostBox'
import PostList from './PostList'
import { Separator } from '@repo/ui/separator'

export default function FeedBox() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Section 1: Navigation */}
      <div className="p-4">
        <Navigation
          followingCount={128}
          followersCount={342}
          communityCount={5}
        />
      </div>

      {/* Separator Line */}
      <Separator className="bg-gray-200" />

      {/* Section 2: Create Post Box */}
      <div className="p-4">
        <CreatePostBox />
      </div>

      {/* Separator Line */}
      <Separator className="bg-gray-200" />

      {/* Section 3: Post List */}
      <div className="p-4">
        <PostList />
      </div>
    </div>
  )
}
