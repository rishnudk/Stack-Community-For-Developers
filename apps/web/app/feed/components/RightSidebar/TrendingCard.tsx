"use client";

export function TrendingCard() {
  const trends = [
    { topic: "React Conf", posts: "12.3K" },
    { topic: "Next.js 15 Release", posts: "8.9K" },
    { topic: "TypeScript 5.6", posts: "4.2K" },
  ];

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
      <h3 className="font-bold text-lg mb-3">What’s happening</h3>

      <div className="space-y-3">
        {trends.map((trend, idx) => (
          <div
            key={idx}
            className="cursor-pointer hover:bg-neutral-800 p-2 rounded-md transition"
          >
            <p className="text-sm text-neutral-400">Trending now</p>
            <p className="font-semibold text-white">{trend.topic}</p>
            <p className="text-sm text-neutral-400">{trend.posts} posts</p>
          </div>
        ))}
      </div>

      <button className="text-sky-500 text-sm mt-4 hover:underline">
        Show more
      </button>
    </div>
  );
}
