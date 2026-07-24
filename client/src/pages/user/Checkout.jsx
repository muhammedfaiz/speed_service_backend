import Footer from "../../components/user/Footer";
import Navbar from "../../components/user/Navbar";
import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate, useParams } from "react-router-dom";
import MapLocation from "../../components/user/MapLocation";
import { ShoppingCart, Minus, Plus, MapPin, Clock3, Wallet, Banknote, CreditCard, Plus as PlusIcon } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const Checkout = () => {
  const { id } = useParams();
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [address, setAddress] = useState({});
  const [cart, setCart] = useState(null);
  const [getAddresses, setAddresses] = useState([]);
  const [isAddressChange, setIsAddressChange] = useState(false);
  const [isQuantityChange, setIsQuantityChange] = useState(false);
  const [isSlotOpen, setIsSlotOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();

  const slotTime = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM",
  ];

  const today = new Date();
  const slotDate = {
    tomorrow: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    nextDay: new Date(today.getTime() + 48 * 60 * 60 * 1000),
  };

  const closeAddressModal = () => setIsAddressOpen(false);
  const closeSlotModal = () => setIsSlotOpen(false);

  useEffect(() => {
    const getAddressesData = async () => {
      const data = await userService.getAddresses();
      setAddresses(data.addresses);
    };
    getAddressesData();
  }, [isAddressChange]);

  useEffect(() => {
    const getCart = async () => {
      const result = await userService.getCheckout(id);
      setCart(result.cart);
    };
    getCart();
  }, [isQuantityChange, id]);

  const addressSubmit = async () => {
    try {
      const result = await userService.addAddressPost(address);
      if (result.status == 200) {
        toast.success(result.data.message);
        setIsAddressChange(!isAddressChange);
        closeAddressModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityUpdate = async (itemId, quantity, categoryId) => {
    try {
      const result = await userService.updateItemQuantity(itemId, categoryId, quantity);
      if (result.status == 200) {
        toast.success(result.data.message);
        setIsQuantityChange(!isQuantityChange);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadPaypalScript = async () => {
    const response = await userService.getClientId();
    const data = JSON.parse(JSON.stringify(response));
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}`;
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadPaypalScript();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedDate || !selectedTime || !paymentMethod) {
      toast.error("Please fill all the required fields");
      return;
    }
    try {
      if (paymentMethod == "cash") {
        const result = await userService.placeOrder({
          cart, selectedAddress, selectedDate, selectedTime, paymentMethod,
        });
        if (result.status == 200) {
          toast.success(result.data.message);
          setCart(null);
          navigate("/success");
        }
      } else {
        toast.error("Please select a payment method");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const successHandler = async (paymentResult) => {
    if (paymentResult) {
      const response = await userService.placeOrder({
        cart, selectedAddress, selectedDate, selectedTime, paymentMethod,
        captureId: paymentResult.purchase_units[0].payments.captures[0].id,
      });
      toast.success(response.data.message);
      setCart(null);
      navigate("/success");
    }
  };

  const errorHandler = (error) => {
    toast.error("Payment Failed, please try again");
    console.log("Error!", error);
  };

  return (
    <>
      <Navbar />
      {cart?.items.length > 0 ? (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-fg font-display">Checkout</h1>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Card hoverable={false}>
                <h2 className="font-semibold text-fg font-display">Order Summary</h2>
                <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                  {cart.items?.map((item) => (
                    <div key={item.item._id} className="flex items-center gap-3">
                      <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
                      <p className="min-w-0 flex-1 truncate text-sm text-fg">{item.item.name}</p>
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-fg-muted hover:bg-slate-200"
                          onClick={() => handleQuantityUpdate(item.item._id, -1, item.item.category)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-sm font-medium text-fg">{item.quantity}</span>
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
                          onClick={() => handleQuantityUpdate(item.item._id, 1, item.item.category)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="w-16 text-right text-sm font-medium text-fg">${item.item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="font-semibold text-fg">Total</p>
                  <p className="font-semibold text-fg">${cart.totalAmount}</p>
                </div>
              </Card>

              <Card hoverable={false}>
                <h2 className="font-semibold text-fg font-display">Payment Summary</h2>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between text-fg-muted">
                    <p>Item Total</p>
                    <p>${cart.totalAmount}.00</p>
                  </div>
                  <div className="flex justify-between text-fg-muted">
                    <p>Discount</p>
                    <p>- ${cart?.discount}.00</p>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-fg">
                    <p>Total</p>
                    <p>${cart.totalAmount}.00</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card hoverable={false}>
                <h2 className="font-semibold text-fg font-display">Address</h2>
                <button
                  onClick={() => setIsAddressOpen(true)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-primary/40 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-50"
                >
                  <PlusIcon size={15} /> Add New Address
                </button>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {getAddresses &&
                    getAddresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-2xl border p-3 text-sm transition-colors ${
                          selectedAddress === addr._id ? "border-primary bg-primary-50" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1"
                          value={addr._id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                        />
                        <div>
                          <p className="font-semibold text-fg">{addr.locality ? addr.locality : addr.place}</p>
                          <p className="text-fg-muted">{addr.place}, {addr.state}</p>
                          <p className="text-fg-muted">{addr.country}</p>
                          <p className="text-fg-muted">{addr.pincode}</p>
                        </div>
                      </label>
                    ))}
                </div>
              </Card>

              <Card hoverable={false}>
                <h2 className="font-semibold text-fg font-display">Slot</h2>
                {selectedDate && selectedTime && (
                  <div className="mt-3 flex items-center gap-4 rounded-xl bg-slate-50 p-3 text-sm">
                    <span className="flex items-center gap-1.5 text-fg"><Clock3 size={14} className="text-primary" /> {selectedDate}</span>
                    <span className="font-medium text-fg">{selectedTime}</span>
                  </div>
                )}
                <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSlotOpen(true)}>
                  {selectedDate && selectedTime ? "Change your time and date" : "Select your time and date"}
                </Button>
              </Card>

              <Card hoverable={false}>
                <h2 className="font-semibold text-fg font-display">Payment Method</h2>
                <div className="mt-4 space-y-3">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-sm font-medium transition-colors ${
                      paymentMethod === "cash" ? "border-primary bg-primary-50" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input type="radio" name="paymentMethod" value="cash" onChange={(e) => setPaymentMethod(e.target.value)} />
                    <Banknote size={17} className="text-primary" /> Cash on Service
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-sm font-medium transition-colors ${
                      paymentMethod === "paypal" ? "border-primary bg-primary-50" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input type="radio" name="paymentMethod" value="paypal" onChange={(e) => setPaymentMethod(e.target.value)} />
                    <CreditCard size={17} className="text-primary" /> PayPal
                  </label>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {paymentMethod === "paypal" ? (
              <PayPalButton amount={cart.totalAmount} onSuccess={successHandler} onError={errorHandler} />
            ) : (
              <Button size="lg" icon={Wallet} onClick={handlePlaceOrder}>
                Place Order
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 py-16">
          <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Add items to your cart to see them here." />
        </div>
      )}
      <Footer />

      <Modal isOpen={isAddressOpen} onClose={closeAddressModal} title="Add New Address" size="lg">
        <MapLocation setAddress={setAddress} />
        <div className="mt-6 flex justify-end">
          <Button icon={MapPin} onClick={addressSubmit}>
            Add Address
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isSlotOpen} onClose={closeSlotModal} title="When should the professional arrive?" size="lg">
        <div className="flex gap-4">
          {Object.entries(slotDate).map(([key, date]) => (
            <button
              key={key}
              className={`flex flex-col items-center rounded-2xl px-6 py-3 transition-colors ${
                selectedDate == date.toDateString() ? "bg-primary text-white" : "border border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => setSelectedDate(date.toDateString())}
            >
              <p className="text-xs">{date.toLocaleDateString(undefined, { weekday: "short" })}</p>
              <p className="mt-0.5 text-base font-semibold">{date.getDate()}</p>
            </button>
          ))}
        </div>

        <h3 className="mt-6 font-semibold text-fg">Select start time of service</h3>
        <div className="mt-3 flex max-h-64 flex-wrap gap-2 overflow-y-auto">
          {slotTime.map((time) => (
            <button
              key={time}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                selectedTime === time ? "bg-primary text-white" : "border border-slate-200 text-fg hover:bg-slate-50"
              }`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={closeSlotModal}>Done</Button>
        </div>
      </Modal>
    </>
  );
};

export default Checkout;
