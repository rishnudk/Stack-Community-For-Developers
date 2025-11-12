"use client";

import { Navigation } from "./Navigation";
import { CreatePostBox } from "./CreatePostBox";
import { ShowMorePosts } from "./ShowMorePosts";
import { PostList } from "./PostList";

export  function FeedBox() {
  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
      {/* Top navigation tabs (For you, Following...) */}
      <Navigation />

      {/* Create new post box */}
      <CreatePostBox />

      {/* Divider: Show more posts */}
      <ShowMorePosts />

      {/* Post feed */}
      <PostList />
    </div>
  );
}
