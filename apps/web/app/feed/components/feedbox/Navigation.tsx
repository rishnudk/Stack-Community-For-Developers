'use client'

import React, { useState } from 'react'
import { Button } from '@repo/ui/button'
import { Card, CardContent } from '@repo/ui/card'
import { Separator } from '@repo/ui/separator'


export function Navigation() {
  const [active, setActive] = useState("For you");
  const tabs = ["For you", "Following", "Startup Community", "Groups"];

  return (
    <nav className="flex justify-around border-b border-neutral-800 bg-black text-white sticky top-0 z-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`py-3 flex-1 text-sm font-semibold transition ${
            active === tab ? "border-b-2 border-sky-500 text-white" : "text-neutral-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}