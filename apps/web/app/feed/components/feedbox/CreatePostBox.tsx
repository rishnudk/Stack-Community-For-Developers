"use client";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Image, Smile, Link, Camera } from "lucide-react";
import ImageNext from "next/image";

export function CreatePostBox() {
  const [content, setContent] = useState("");

  return (
    <div className="flex flex-col border-b border-neutral-800 p-4 bg-black text-white">
      <div className="flex items-start gap-3">
        <ImageNext
          src="/profile.png"
          alt="profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <textarea
          className="flex-1 bg-transparent resize-none outline-none text-lg placeholder-neutral-500"
          placeholder="What’s happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-4 text-neutral-400">
          <Image size={18} />
          <Smile size={18} />
          <Link size={18} />
          <Camera size={18} />
        </div>
        <Button
          
          className="rounded-full bg-sky-500 hover:bg-sky-600 px-5"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
