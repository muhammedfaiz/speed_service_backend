import { Bell } from "lucide-react";
import { useNotificationContext } from "../../context/NotificationContext";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

const Notifications = () => {
  const { employeeNotifications } = useNotificationContext();

  return (
    <Card hoverable={false}>
      <h3 className="text-lg font-semibold text-fg font-display">Notifications</h3>
      {employeeNotifications.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {employeeNotifications.map((notification, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Bell size={16} />
              </span>
              <p className="text-sm text-fg">{notification}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Bell} title="No new notifications" description="You're all caught up." />
      )}
    </Card>
  );
};

export default Notifications;
