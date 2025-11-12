"use client";
import { Briefcase } from "lucide-react";

export default function ActionCard() {
  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 text-sm text-white">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={16} className="text-yellow-500" />
        <p className="text-neutral-300 font-medium">
          Boost your job search with Premium
        </p>
      </div>

      <button className="mt-2 w-full border border-yellow-500 text-yellow-500 rounded-full py-1.5 font-medium hover:bg-yellow-500 hover:text-black transition">
        Try for ₹0
      </button>
    </div>
  );
}
