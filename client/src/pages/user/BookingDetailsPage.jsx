import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../services/userService";
import Navbar from "../../components/user/Navbar";
import {
  CalendarDays, Clock3, DollarSign, User as UserIcon, Home, MapPinned,
  Flag, Globe2, Mail, ClipboardList, MessageCircle, Briefcase, Star, XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "../../components/ui/Modal";
import Chat from "../../components/common/Chat";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const STATUS_VARIANT = { Pending: "warning", Completed: "accent", Commited: "primary", Cancelled: "danger" };

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [review, setReview] = useState({ id: null, rating: 0, comment: "" });
  const [errors, setErrors] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await userService.fetchBookingDetails(id);
        setBooking(result.booking);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooking();
  }, [id, isChange]);

  const validateReview = () => {
    const errors = {};
    if (!review.rating) {
      errors.rating = "Rating is required.";
    }
    if (!review.comment) {
      errors.comment = "Comment is required.";
    }
    return errors;
  };

  const handleCancelBooking = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Once cancelled, you won't be able to undo this action.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563EB",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Yes, cancel it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await userService.cancelBooking(id);
          if (response.status === 200) {
            toast.success(response.data.message);
            setIsChange(!isChange);
          }
        }
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateReview();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await userService.submitReview(review);
      if (response.status === 200) {
        toast.success(response.data.message);
        setReview({ id: null, rating: 0, comment: "" });
        setIsReviewOpen(false);
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-fg font-display">Booking Details</h1>
        <p className="mt-1 text-fg-muted">Review all the information related to your booking below.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card hoverable={false}>
            <h2 className="mb-4 font-semibold text-fg font-display">Booking Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><CalendarDays size={15} className="text-primary" /> Booked Date</span>
                <span className="text-fg">{booking?.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><Clock3 size={15} className="text-primary" /> Booked Time</span>
                <span className="text-fg">{booking?.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><ClipboardList size={15} className="text-primary" /> Status</span>
                <Badge variant={STATUS_VARIANT[booking?.status] || "neutral"}>{booking?.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><DollarSign size={15} className="text-primary" /> Total Amount</span>
                <span className="font-semibold text-fg">${booking?.totalAmount}</span>
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <h2 className="mb-4 font-semibold text-fg font-display">Service Provider Info</h2>
            {booking?.employee ? (
              <>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-fg-muted"><UserIcon size={15} className="text-primary" /> Name</span>
                    <span className="text-fg">{booking?.employee?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-fg-muted"><Briefcase size={15} className="text-primary" /> Designation</span>
                    <span className="text-fg">{booking?.category?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-fg-muted"><Clock3 size={15} className="text-primary" /> Experience</span>
                    <span className="text-fg">{booking?.employee?.experience} years</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={MessageCircle} className="mt-4 w-full" onClick={() => setIsChatOpen(true)}>
                  Chat
                </Button>
              </>
            ) : (
              <p className="text-sm text-fg-muted">The service provider has not yet been committed.</p>
            )}
          </Card>

          <Card hoverable={false}>
            <h2 className="mb-4 font-semibold text-fg font-display">Address Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><Home size={15} className="text-primary" /> Locality</span>
                <span className="text-fg">{booking?.address?.locality}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><MapPinned size={15} className="text-primary" /> Place</span>
                <span className="text-fg">{booking?.address?.place}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><Flag size={15} className="text-primary" /> State</span>
                <span className="text-fg">{booking?.address?.state}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><Globe2 size={15} className="text-primary" /> Country</span>
                <span className="text-fg">{booking?.address?.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-fg-muted"><Mail size={15} className="text-primary" /> Pincode</span>
                <span className="text-fg">{booking?.address?.pincode}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card hoverable={false} className="mt-6">
          <h2 className="mb-4 font-semibold text-fg font-display">Order Service</h2>
          <div className="space-y-4">
            {booking.orderItems?.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt="service" className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-medium text-fg">{item.item.name}</p>
                    <p className="text-sm text-fg-muted">{item.quantity} units · ${item.item.price}</p>
                  </div>
                </div>
                {booking.status == "Completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Star}
                    onClick={() => {
                      setIsReviewOpen(true);
                      setReview({ id: item.item._id });
                    }}
                  >
                    Rate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {booking.status !== "Completed" && booking.status !== "Cancelled" && (
          <div className="mt-6 flex justify-end">
            <Button variant="danger" icon={XCircle} onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Add a Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button type="button" key={star} onClick={() => setReview({ ...review, rating: star })}>
                <Star size={26} className={review.rating >= star ? "text-amber-500" : "text-slate-300"} fill={review.rating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
          <textarea
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
            rows={4}
            placeholder="Write your review here..."
            value={review.comment || ""}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
          />
          {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
          <div className="flex justify-end">
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Modal>

      {booking?.employee && <Chat isOpen={isChatOpen} setIsOpen={setIsChatOpen} receiver={booking.employee} />}
    </>
  );
};

export default BookingDetailsPage;
