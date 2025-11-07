'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Card, CardContent } from '@repo/ui/card';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface LeftSidebarProps {
  session: Session;
}

const LeftSidebar = ({ session }: LeftSidebarProps) => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navigation = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Logo/Brand Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">MyApp</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? 'primary' : 'secondary'}
              className={`w-full flex items-center ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Link href={item.href} className="flex items-center">
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="danger"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

export default LeftSidebar; 