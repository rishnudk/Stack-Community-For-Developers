import { Briefcase } from "lucide-react";

export default function ActionCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={16} className="text-yellow-600" />
        <p className="text-gray-700 font-medium">
          Boost your job search with Premium
        </p>
      </div>
      <button className="mt-2 w-full border border-yellow-600 text-yellow-700 rounded-lg py-1 hover:bg-yellow-50 transition">
        Try for ₹0
      </button>
    </div>
  );
}
