import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Cover image */}
      <div className="h-16 bg-gradient-to-r from-blue-500 to-indigo-500" />

      {/* Profile section */}
      <div className="flex flex-col items-center p-4 -mt-8">
        <Image
          src="/rishnudk.jpg"
          alt="Profile photo"
          width={64}
          height={64}
          className="rounded-full border-4 border-white shadow-sm"
        />
        <h2 className="mt-2 text-lg font-semibold text-gray-800">Rishnu Dk</h2>
        <p className="text-sm text-gray-500 text-center">
          MERN Stack Developer | Next.js | REST APIs | Clerk | Convex | Git
        </p>
        <p className="text-xs text-gray-400 mt-1">Kannur, Kerala</p>

        <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-500">
          <Image src="/file.svg" width={16} height={16} alt="Brototype" />
          <span>Brototype</span>
        </div>
      </div>
    </div>
  );
}
