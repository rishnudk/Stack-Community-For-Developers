import ProfileCard from "./ProfileCard";
import AnalyticsCard from "./AnalyticCard";
import ActionCard from "./ActionCard";

export  function Sidebar() {
  return (
    <aside className="w-72 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col gap-3">
      <ProfileCard />
      <AnalyticsCard />
      <ActionCard />
    </aside>
  );
}
