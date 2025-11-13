import {
  IconSchool,
  IconUsers,
  IconFileText,
  IconPackages,
} from "@tabler/icons-react";

const StatCard = ({ title, value, icon, iconColor }: any) => (
  <div className="rounded-xl border border-gray-200 dark:border-neutral-800 p-5 flex items-center gap-4 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300">
    <div className={`p-3 rounded-lg  ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

export function StatCards({ stats }: { stats: any }) {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={stats.total_students ?? 0}
        icon={<IconUsers size={30} />}
        iconColor='text-blue-400'
      />
      <StatCard
        title="Total Courses"
        value={stats.total_courses ?? 0}
        icon={<IconSchool size={30} />}
        iconColor='text-blue-400'
      />
      <StatCard
        title="Total Resources"
        value={stats.total_resources ?? 0}
        icon={<IconFileText size={30} />}
        iconColor='text-blue-400'
      />
      <StatCard
        title="Total Bundles"
        value={stats.total_bundles ?? 0}
        icon={<IconPackages size={30} />}
        iconColor='text-blue-400'
      />
    </div>
  );
}
