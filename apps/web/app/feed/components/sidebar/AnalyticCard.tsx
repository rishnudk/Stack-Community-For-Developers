export default function AnalyticsCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <ul className="text-sm">
        <li className="flex justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
          <span className="text-gray-600">Profile viewers</span>
          <span className="text-blue-600 font-semibold">268</span>
        </li>
        <li className="flex justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
          <span className="text-gray-600">Post impressions</span>
          <span className="text-blue-600 font-semibold">204</span>
        </li>
      </ul>
    </div>
  );
}
