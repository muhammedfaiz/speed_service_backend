import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { fetchRecentActivities } from "../../services/employeeService";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const getRecentActivities = async () => {
      const data = await fetchRecentActivities();
      setActivities(data.activities);
    };
    getRecentActivities();
  }, []);

  return (
    <Card hoverable={false}>
      <h3 className="text-lg font-semibold text-fg font-display">Recent Activities</h3>
      {!activities || activities.length === 0 ? (
        <EmptyState icon={History} title="No recent activity" description="Completed jobs and feedback will appear here." />
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {activities.map((activity) => (
            <li key={activity._id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-fg-muted">
                  <History size={18} />
                </span>
                <div>
                  <p className="font-medium text-fg">{activity.orderId}</p>
                  <p className="text-sm text-fg-muted">{activity.date}</p>
                </div>
              </div>
              <p className="text-sm font-medium italic text-accent-600">{activity.feedback}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentActivities;
