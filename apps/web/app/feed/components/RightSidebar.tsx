'use client'
import { Search } from 'lucide-react';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
 import React from 'react'

interface RightSidebarProps {
    session: Session;
}
 
const  RightSidebar =  ({ session} : RightSidebarProps) => {
    const pathname = usePathname();

    //Mock data
    const trendingTopics = [
        { tag: 'JavaScript', count: 100 },
        { tag: 'React', count: 80 },
        { tag: 'Next.js', count: 60 },
        { tag: 'Tailwind', count: 40 },
        { tag: 'TypeScript', count: 20 },
    ]

    const followSuggetction = [
        { name: 'John Doe', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Jane Smith', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Alice Johnson', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Bob Brown', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Charlie Davis', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Diana White', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Eve Green', image: 'https://via.placeholder.com/150', isFollowing: false },
        { name: 'Frank Black', image: 'https://via.placeholder.com/150', isFollowing: false },
    ]


    
   return (
     <aside className='w-64 min-h-screen bg-white border-l border-gray-200 p-4 flex flex-col'>
        <div>
            {/* search box */}
            <div className='relative mb-6'>

                <Search className='absolute left-3 top-1/2 trasform '/>
                <input type="text"
                placeholder='Search posts or users'
                className='w-full pl-10 pr-3 py-2 border border-gray-300' />
            </div>
        </div>
     </aside>
   )
 }

 export default RightSidebar;
 
 