'use client';

import React from 'react';
import { NotificationsBell } from './NotificationsBell';

export function HeaderBar() {
  return (
    <div className="flex items-center justify-end">
      <NotificationsBell />
    </div>
  );
}
