import Navbar from "../../components/employee/Navbar";
import { useEffect, useState } from "react";
import { getTasks, taskComplete } from "../../services/employeeService";
import { toast } from "react-toastify";
import { Check, MessageCircle, ClipboardList } from "lucide-react";
import Chat from "../../components/common/Chat";
import BookingCard from "../../components/employee/BookingCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [receiver, setReceiver] = useState(null);

  const handleComplete = async (id) => {
    const result = await taskComplete(id);
    if (result.status == 200) {
      setIsChange(!isChange);
      toast.success(result.data.message);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data.tasks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, [isChange]);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-fg font-display">Tasks Committed</h1>
        <p className="mt-1 text-fg-muted">List of tasks accepted from customers.</p>

        <div className="mt-8">
          {tasks.length > 0 ? (
            tasks.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                statusVariant="primary"
                actions={
                  <>
                    <Button size="sm" icon={Check} onClick={() => handleComplete(booking._id)}>
                      Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={MessageCircle}
                      onClick={() => {
                        setIsChatOpen(true);
                        setReceiver(booking.user);
                      }}
                    >
                      Chat
                    </Button>
                  </>
                }
              />
            ))
          ) : (
            <EmptyState icon={ClipboardList} title="No tasks pending" description="Committed tasks will show up here." />
          )}
        </div>
      </div>
      <Chat isOpen={isChatOpen} setIsOpen={setIsChatOpen} isEmployee={true} receiver={receiver} />
    </>
  );
};

export default EmployeeTasks;
