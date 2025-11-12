"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";

interface PostCardProps {
  userName: string;
  userTagline?: string;
  content: string;
  imageUrl?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

export const PostCard = ({
  userName,
  userTagline,
  content,
  imageUrl,
  likes = 0,
  comments = 0,
  shares = 0,
}: PostCardProps) => {
  return (
    <Card className="w-full max-w-xl mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg">{userName}</p>
          <p className="text-sm text-muted-foreground">{userTagline}</p>
        </div>
        <span className="text-xs text-muted-foreground">Ad</span>
      </div>

      {/* Content */}
      <div className="mt-3 text-sm leading-relaxed whitespace-pre-line text-center">
        {content}
      </div>

      {/* Centered Image */}
      {imageUrl && (
        <div className="mt-4 flex justify-center">
          <Image
            src={imageUrl}
            alt="Post image"
            width={450}
            height={300}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800"
          />
        </div>
      )}

      {/* Footer actions */}
      <CardContent className="flex items-center justify-center gap-6 mt-4 text-muted-foreground">
        <div className="flex items-center gap-1 text-sm">
          <Heart className="h-4 w-4" /> {likes}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <MessageCircle className="h-4 w-4" /> {comments}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Repeat2 className="h-4 w-4" /> {shares}
        </div>
      </CardContent>
    </Card>
  );
};
