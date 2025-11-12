"use client";
import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden text-white">
      {/* Cover Image */}
      <div className="h-16 bg-linear-to-r from-sky-600/90 to-indigo-600/90" />

      {/* Profile Section */}
      <div className="flex flex-col items-center p-4 -mt-8">
        <Image
          src="/rishnudk.jpg"
          alt="Profile photo" 
          width={64}
          height={64}
          className="rounded-full border-4 border-neutral-900 shadow-sm"
        />
        <h2 className="mt-2 text-lg font-semibold text-white">Rishnu Dk</h2>
        <p className="text-sm text-neutral-400 text-center">
          MERN Stack Developer | Next.js | REST APIs | Clerk | Convex | Git
        </p>
        <p className="text-xs text-neutral-500 mt-1">Kannur, Kerala</p>

        <div className="mt-2 flex items-center justify-center gap-1 text-sm text-neutral-400">
          <Image src="/file.svg" width={16} height={16} alt="Brototype" />
          <span>Brototype</span>
        </div>
      </div>
    </div>
  );
}
