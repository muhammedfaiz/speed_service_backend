import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ListChecks, DollarSign, CheckCircle2 } from "lucide-react";
import { fetchEmployeeStats } from "../../services/employeeService";
import Card from "../ui/Card";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const StatisticsOverview = () => {
  const [completed, setCompleted] = useState(0);
  const [pendingRequest, setPendingRequest] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await fetchEmployeeStats();
      if (data) {
        setCompleted(data.completed);
        setPendingRequest(data.pendingRequest);
        setEarnings(data.earnings);
        setCompletionRate(data.completionRate);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Completed Bookings", value: completed || 0, icon: ClipboardList, color: "text-primary bg-primary-50" },
    { label: "Pending Requests", value: pendingRequest || 0, icon: ListChecks, color: "text-accent-600 bg-accent-50" },
    { label: "Total Earnings", value: `$${earnings || 0}`, icon: DollarSign, color: "text-amber-600 bg-amber-50" },
    { label: "Task Completion Rate", value: `${completionRate || 0}%`, icon: CheckCircle2, color: "text-secondary bg-secondary-50" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={fadeUp}>
          <Card className="flex items-center gap-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
              <stat.icon size={22} />
            </span>
            <div>
              <p className="text-sm text-fg-muted">{stat.label}</p>
              <p className="text-2xl font-bold text-fg font-display">{stat.value}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatisticsOverview;
