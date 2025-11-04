'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';

export function NotificationsBell() {
  const { data: notifications, refetch, isFetching } = trpc.getNotifications.useQuery();
  const markRead = trpc.markNotificationRead.useMutation({
    onSuccess: () => refetch(),
  });
  const markAll = trpc.markAllNotificationsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const unread = (notifications || []).filter((n) => !n.read).length;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-10">
          <div className="flex items-center justify-between p-2 border-b">
            <div className="font-semibold">Notifications</div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => markAll.mutate()}
              disabled={isFetching || markAll.isPending}
            >
              Mark all read
            </Button>
          </div>
          <div className="max-h-80 overflow-auto">
            {(notifications || []).length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No notifications</div>
            ) : (
              (notifications || []).map((n) => (
                <div key={n.id} className={`p-3 text-sm border-b ${n.read ? 'bg-white' : 'bg-blue-50'}`}>
                  <div>{n.message}</div>
                  <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                  {!n.read && (
                    <div className="mt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => markRead.mutate({ id: n.id })}
                        disabled={markRead.isPending}
                      >
                        Mark read
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
