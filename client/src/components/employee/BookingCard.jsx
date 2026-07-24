/* eslint-disable react/prop-types */
import { Calendar, Clock, User, MapPin, ClipboardList, CreditCard } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const BookingCard = ({ booking, statusVariant = "outline", actions }) => {
  return (
    <Card className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-fg font-display">
            <User size={18} className="text-primary" /> {booking?.user?.name}
          </h2>
          <div className="mt-1 flex items-center gap-4 text-sm text-fg-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {booking.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {booking.time}
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-fg">${booking.totalAmount}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-fg-muted">
        <p className="flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-red-500" />
          <span>
            <strong className="text-fg">Address:</strong> {booking?.address?.locality}, {booking?.address?.place},{" "}
            {booking?.address?.state}, {booking?.address?.pincode}
          </span>
        </p>
        <p className="flex items-start gap-2">
          <ClipboardList size={15} className="mt-0.5 shrink-0 text-amber-500" />
          <span>
            <strong className="text-fg">Service:</strong>{" "}
            {booking?.orderItems?.map((item, index) => (
              <span key={item._id}>
                {item?.item?.name} (No. of units: {item.quantity})
                {index < booking.orderItems.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </p>
        {booking.paymentMethod && (
          <p className="flex items-center gap-2">
            <CreditCard size={15} className="shrink-0 text-accent-600" />
            <strong className="text-fg">Payment Method:</strong> {booking.paymentMethod}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Badge variant={statusVariant}>{booking.status}</Badge>
        <div className="flex gap-3">{actions}</div>
      </div>
    </Card>
  );
};

export default BookingCard;
