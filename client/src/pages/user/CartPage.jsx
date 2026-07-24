import { ShoppingCart, ArrowRight } from "lucide-react";
import Navbar from "../../components/user/Navbar";
import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const CartPage = () => {
  const [carts, setCarts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCarts = async () => {
      const result = await userService.fetchCarts();
      setCarts(result.carts);
    };
    fetchCarts();
  }, []);
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <ShoppingCart size={20} />
          </span>
          <h1 className="text-2xl font-bold text-fg font-display">Your Cart</h1>
        </div>

        {carts.length > 0 ? (
          <div className="space-y-4">
            {carts.map((cart) => (
              <Card key={cart._id} className="flex flex-wrap items-center gap-4">
                <img src={cart.imageUrl} alt="Service" className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-fg">{cart.category.name} Service</h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {cart.items.length} service{cart.items.length !== 1 ? "s" : ""} · ${cart.totalAmount}
                  </p>
                </div>
                <Button icon={ArrowRight} iconPosition="right" onClick={() => navigate(`/checkout/${cart._id}`)}>
                  Checkout
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add items to your cart to see them here."
            action={
              <Button to="/services" variant="outline">
                Browse Services
              </Button>
            }
          />
        )}
      </div>
    </>
  );
};

export default CartPage;
