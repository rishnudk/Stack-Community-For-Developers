"use client";
import Image from "next/image";
import { Button } from "@repo/ui/button";

interface Suggestion {
  name: string;
  username: string;
  image: string;
}

export function SuggestionsCard() {
  const suggestions: Suggestion[] = [
    {
      name: "Soumya",
      username: "kush_soumya",
      image: "/avatars/user1.jpg",
    },
    {
      name: "Sankha Mukherjee",
      username: "SankhaAscend",
      image: "/avatars/user2.jpg",
    },
    {
      name: "Danywalls 👋",
      username: "danywalls",
      image: "/avatars/user3.jpg",
    },
  ];

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
      <h3 className="font-bold text-lg mb-3">You might like</h3>

      <div className="space-y-3">
        {suggestions.map((user, idx) => (
          <div key={idx} className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold leading-tight">{user.name}</p>
                <p className="text-sm text-neutral-400">@{user.username}</p>
              </div>
            </div>

            {/* Follow button */}
            <Button
              
              className="bg-white text-black rounded-full hover:bg-neutral-200"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>

      <button className="text-sky-500 text-sm mt-4 hover:underline">
        Show more
      </button>
    </div>
  );
}
