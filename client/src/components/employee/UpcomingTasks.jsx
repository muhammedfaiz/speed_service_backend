import { useEffect, useState } from "react";
import { Wrench, Check, CalendarClock } from "lucide-react";
import { getTasks, taskComplete } from "../../services/employeeService";
import { toast } from "react-toastify";
import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data.tasks);
    };
    fetchTasks();
  }, [isChange]);

  async function handleComplete(id) {
    const response = await taskComplete(id);
    if (response.status == 200) {
      setIsChange(!isChange);
      toast.success(response.data.message);
    }
  }

  return (
    <Card hoverable={false}>
      <h3 className="text-lg font-semibold text-fg font-display">Upcoming Tasks</h3>
      {tasks.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No upcoming tasks" description="Accepted bookings will show up here." />
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {tasks.map((task) => (
            <li key={task._id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Wrench size={18} />
                </span>
                <div>
                  <p className="font-medium text-fg">{task.user.name}</p>
                  <p className="text-sm text-fg-muted">
                    {task.orderItems.map((item, index) => (
                      <span key={item._id}>
                        {item.item.name}
                        {index < task.orderItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="text-xs text-fg-subtle">Due: {task.date}</p>
                </div>
              </div>
              <Button size="sm" icon={Check} onClick={() => handleComplete(task._id)}>
                Complete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default UpcomingTasks;
