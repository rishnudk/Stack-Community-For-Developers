"use client";
import { PostCard } from "./PostCard";

export function PostList() {
  const posts = [
    {
      name: "aditya",
      username: "adxtyahq",
      time: "19h",
      text: "name a better alternative to this. i’ll wait.",
      imageUrl: "/gmail.png",
    },
    {
      name: "rishnu",
      username: "rishnudk",
      time: "1d",
      text: "Just finished my MERN stack project setup with Turborepo 🚀",
    },
  ];

  return (
    <div>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
}
