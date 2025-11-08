'use client'

import React, { useState } from 'react'
import { Button } from '@repo/ui/button'
import { Card, CardContent } from '@repo/ui/card'
import { Separator } from '@repo/ui/separator'



interface NavigationProps {
    followingCount?: number
    followersCount?: number
    communityCount?: number
  }
  
  export default function Navigation({
    followingCount = 0,
    followersCount = 0,
    communityCount = 0,
  }: NavigationProps) {
    const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'community'>('following')
  
    const tabs = [
      { key: 'following', label: 'Following', count: followingCount },
      { key: 'followers', label: 'Followers', count: followersCount },
      { key: 'community', label: 'Community', count: communityCount },
    ]
  
    return (
      <div className="bg-white border rounded-xl flex justify-around py-4 mb-6 shadow-sm">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.key}>
            <div
              onClick={() => setActiveTab(tab.key as any)}
              className={`cursor-pointer flex flex-col items-center transition-colors ${
                activeTab === tab.key ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <p className="text-xl font-semibold">{tab.count}</p>
              <p className="text-sm">{tab.label}</p>
            </div>
            {index < tabs.length - 1 && <Separator orientation="vertical" className="h-8" />}
          </React.Fragment>
        ))}
      </div>
    )
  }