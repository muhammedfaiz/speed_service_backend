import Navbar from "../../components/user/Navbar";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, CreditCard, Info, CalendarX2 } from "lucide-react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const STATUS_VARIANT = {
  Completed: "accent",
  Cancelled: "danger",
  Commited: "primary",
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await userService.getBookings();
        setBookings(result.bookings);
      } catch (error) {
        console.log("Error fetching bookings", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-fg font-display">Your Bookings</h1>
        <p className="mt-1 text-fg-muted">Track and manage all your service bookings.</p>

        <div className="mt-8 space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.orderId} hoverable={false}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-fg">Order #{booking.orderId}</h3>
                  <Badge variant={STATUS_VARIANT[booking.status] || "warning"}>{booking.status}</Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-fg-muted">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-primary" /> {new Date(booking.date).toDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={15} className="text-primary" /> {booking.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <CreditCard size={15} className="text-primary" /> {booking.paymentMethod}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" icon={Info} onClick={() => navigate(`/booking-details/${booking._id}`)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState icon={CalendarX2} title="No bookings found" description="Your service bookings will show up here." />
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
