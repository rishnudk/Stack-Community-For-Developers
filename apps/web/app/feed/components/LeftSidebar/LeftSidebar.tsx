"use client";
import type { Session } from "next-auth";
import ProfileCard from "./ProfileCard";
import AnalyticsCard from "./AnalyticsCard";
import ActionCard from "./ActionCard";
import SidebarLogo from "./SidebarLogo";

interface LeftSidebarProps {
  session: Session;
}

export function LeftSidebar({ session }: LeftSidebarProps) {
  return (
    <aside className="w-72 bg-black rounded-2xl flex flex-col gap-4">
      <SidebarLogo />
      <ProfileCard />
      <AnalyticsCard />
      <ActionCard />
    </aside>
  );
}
