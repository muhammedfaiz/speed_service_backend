import { useParams } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import { useEffect, useState } from "react";
import userService from "../../services/userService";
import Footer from "../../components/user/Footer";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { Star, ShoppingCart, Minus, Plus, MessageSquareText } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";

const ServiceBookingPage = () => {
  const { id } = useParams();
  const [service, setService] = useState({});
  const [cart, setCart] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [overAllRating, setOverAllRating] = useState(5);

  useEffect(() => {
    const getServiceData = async () => {
      const data = await userService.getServiceDetails(id);
      setService(data.service);
      setReviews(data.reviews);
    };
    getServiceData();
  }, [id]);

  useEffect(() => {
    const getCartData = async () => {
      const result = await userService.getCartDetails(service.category?._id);
      setCart(result.cart);
    };
    getCartData();
  }, [isChange, service]);

  useEffect(() => {
    if (reviews.length > 0) {
      let totalRating = 0;
      reviews.forEach((review) => {
        totalRating += review.rating;
      });
      setOverAllRating(Math.round(totalRating / reviews.length));
    }
  }, [reviews]);

  const handleAddtoCart = async (id) => {
    try {
      const result = await userService.addToCart(id);
      if (result.status === 200) {
        toast.success(result.data.message);
        setIsChange(!isChange);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityUpdate = async (itemId, categoryId, quantity) => {
    try {
      const result = await userService.updateItemQuantity(itemId, categoryId, quantity);
      if (result.status === 200) {
        toast.success(result.data.message);
        setIsChange(!isChange);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-fg font-display">{service.name}</h1>
            <div className="mt-3 flex items-center gap-1.5 text-amber-500">
              <Star size={18} fill="currentColor" strokeWidth={0} />
              <span className="text-sm font-semibold text-fg">{overAllRating}.0 ratings</span>
            </div>

            <Card hoverable={false} className="mt-6">
              <span className="text-sm font-semibold text-primary">{service.category?.name}</span>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-xl font-bold text-fg">${service.price}</p>
                <Button icon={ShoppingCart} onClick={() => handleAddtoCart(service._id)}>
                  Add
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <img src={service.imageUrl} alt={service.name} className="h-72 w-full rounded-3xl object-cover lg:h-[28rem]" />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Card hoverable={false} className="min-h-40">
              {cart.items?.length > 0 ? (
                <>
                  <h2 className="text-lg font-semibold text-fg font-display">Cart</h2>
                  <div className="mt-4 space-y-3">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm text-fg">{item.item.name}</p>
                        <div className="flex items-center gap-2">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-fg-muted hover:bg-slate-200"
                            onClick={() => handleQuantityUpdate(item.item._id, item.item.category, -1)}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center text-sm font-medium text-fg">{item.quantity}</span>
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
                            onClick={() => handleQuantityUpdate(item.item._id, item.item.category, 1)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="w-14 text-right text-sm font-medium text-fg">${item.quantity * item.item.price}</p>
                      </div>
                    ))}
                  </div>
                  <Button to="/cart" className="mt-6 w-full justify-between">
                    <span>${cart.totalAmount}</span>
                    <span>View Cart</span>
                  </Button>
                </>
              ) : (
                <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Add items to your cart to see them here." />
              )}
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-fg font-display">Reviews</h3>
            {reviews?.length > 0 ? (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id} hoverable={false}>
                    <div className="flex items-center gap-3">
                      <Avatar name={review?.user?.name} size="sm" />
                      <div>
                        <p className="font-semibold text-fg">{review?.user?.name}</p>
                        <span className="text-xs italic text-fg-subtle">
                          {formatDistanceToNow(new Date(review.createdAt))} ago
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill={i < review?.rating ? "currentColor" : "none"} className={i < review?.rating ? "" : "text-slate-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-fg-muted">{review?.comment}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState icon={MessageSquareText} title="No reviews yet" description="Be the first to review this service." />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceBookingPage;
