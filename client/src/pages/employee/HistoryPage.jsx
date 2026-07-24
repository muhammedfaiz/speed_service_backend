import { useEffect, useState } from "react";
import Navbar from "../../components/employee/Navbar";
import { CheckCircle2, MapPin, ListChecks, History as HistoryIcon } from "lucide-react";
import { getCompletedTasks } from "../../services/employeeService";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getCompletedTasks();
      setHistoryData(data.history);
    };
    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-fg font-display">Service History</h1>
        <p className="mt-1 text-fg-muted">History of service provided.</p>

        <div className="mt-8">
          {historyData.length === 0 ? (
            <EmptyState icon={HistoryIcon} title="No service history yet" description="Completed bookings will show up here." />
          ) : (
            <div className="space-y-6">
              {historyData.map((history) => (
                <Card key={history._id} hoverable={false}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-fg font-display">{history.user.name}</h2>
                      <p className="text-sm text-fg-muted">
                        {history.date} at {history.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-accent-600">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold">{history.status}</span>
                    </div>
                    <p className="text-lg font-bold text-fg">${history.totalAmount}</p>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-fg-muted">
                    <p className="flex items-start gap-2">
                      <ListChecks size={15} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        <strong className="text-fg">Items:</strong>{" "}
                        {history?.orderItems?.map((item, index) => (
                          <span key={item._id}>
                            {item?.item?.name} (No. of units: {item.quantity})
                            {index < history.orderItems.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-red-500" />
                      <span>
                        <strong className="text-fg">Address:</strong> {history.address.locality}, {history.address.place},{" "}
                        {history.address.state}, {history.address.country}, {history.address.pincode}
                      </span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
