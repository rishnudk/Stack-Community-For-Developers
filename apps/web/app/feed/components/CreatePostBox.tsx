'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@repo/ui/card'
import { Button } from '@repo/ui/button'
import { Textarea } from '@repo/ui/textarea'

export default function CreatePostBox() {
  const [postContent, setPostContent] = useState('')

  const handleSubmit = () => {
    if (!postContent.trim()) return
    console.log('Posting:', postContent)
    setPostContent('')
  }

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Create Post</h3>
        <Textarea
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="w-full mb-3 resize-none"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!postContent.trim()}>
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
