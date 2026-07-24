import { useEffect, useState } from "react";
import Navbar from "../../components/employee/Navbar";
import { ClipboardCheck, Inbox } from "lucide-react";
import { acceptRequest, getRequests } from "../../services/employeeService";
import { toast } from "react-toastify";
import BookingCard from "../../components/employee/BookingCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const EmployeeRequestPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getRequests();
        setBookings(result.bookings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookings();
  }, [isChange]);

  const handleAcceptBooking = async (id) => {
    const result = await acceptRequest(id);
    if (result.status === 200) {
      setIsChange(!isChange);
      toast.success(result.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-fg font-display">Booking Requests</h1>
        <p className="mt-1 text-fg-muted">Review and accept the booking requests from customers.</p>

        <div className="mt-8">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                statusVariant="warning"
                actions={
                  <Button size="sm" icon={ClipboardCheck} onClick={() => handleAcceptBooking(booking._id)}>
                    Accept Booking
                  </Button>
                }
              />
            ))
          ) : (
            <EmptyState icon={Inbox} title="No booking requests" description="New requests from customers will show up here." />
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeRequestPage;
