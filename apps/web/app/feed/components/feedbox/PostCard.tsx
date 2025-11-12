"use client";
import Image from "next/image";
import { Ellipsis } from "lucide-react";

export function PostCard({
  name,
  username,
  time,
  text,
  imageUrl,
}: {
  name: string;
  username: string;
  time: string;
  text: string;
  imageUrl?: string;
}) {
  return (
    <div className="flex flex-col border-b border-neutral-800 bg-black text-white p-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Image src="/profile.png" alt="user" width={40} height={40} className="rounded-full" />
          <div>
            <p className="font-semibold">
              {name} <span className="text-neutral-500">@{username} · {time}</span>
            </p>
            <p className="text-neutral-200 mt-1">{text}</p>
          </div>
        </div>
        <Ellipsis className="text-neutral-400" size={18} />
      </div>

      {imageUrl && (
        <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-800">
          <Image src={imageUrl} alt="post image" width={500} height={350} />
        </div>
      )}
    </div>
  );
}
