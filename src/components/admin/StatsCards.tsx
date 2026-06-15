import { Users, FileStack, Inbox, type LucideIcon } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  totalContent: number;
  totalRequests: number;
}

const Stat = ({
  label,
  value,
  Icon,
  from,
  to,
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
  from: string;
  to: string;
}) => (
  <div className="relative bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgba(20,20,20,0.05)] hover:shadow-[0_16px_40px_rgba(20,20,20,0.10)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    <div
      className="absolute -top-10 -left-10 w-28 h-28 rounded-full opacity-10"
      style={{ background: from }}
    />
    <div className="flex items-center justify-between relative">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-4xl font-extrabold text-gray-900">
          {value.toLocaleString("en-US")}
        </p>
      </div>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: `0 10px 24px ${from}40`,
        }}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </div>
);

export function StatsCards({
  totalUsers,
  totalContent,
  totalRequests,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <Stat label="المستخدمين" value={totalUsers} Icon={Users} from="#8A1538" to="#A91D45" />
      <Stat label="المحتوى" value={totalContent} Icon={FileStack} from="#A91D45" to="#C13A5E" />
      <Stat label="الطلبات" value={totalRequests} Icon={Inbox} from="#6E1029" to="#8A1538" />
    </div>
  );
}
