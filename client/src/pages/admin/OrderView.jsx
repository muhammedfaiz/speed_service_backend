import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, HardHat } from "lucide-react";
import { getOrderDetails } from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const STATUS_VARIANT = { Completed: "accent", Commited: "primary", Cancelled: "danger" };

const OrderView = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderDetails(id);
      setOrderDetails(data.order);
    };
    fetchOrder();
  }, [id]);

  return (
    <AdminLayout title="Order Details" subtitle="Details of order.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card hoverable={false} className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-fg font-display">Items</h2>
          <div className="space-y-3">
            {orderDetails?.orderItems?.map((item) => (
              <div key={item?.item?._id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <img
                  src={item?.item?.imageUrl || "/default-service-image.jpg"}
                  alt={item?.item?.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div>
                  <p className="font-medium text-fg">{item?.item?.name}</p>
                  <p className="text-fg-muted">${item?.item?.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <h3 className="font-semibold text-fg">Order Information</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="flex items-center gap-1.5 text-fg-muted">
                  <CalendarDays size={14} /> Date
                </p>
                <p className="mt-1 text-fg">{orderDetails?.date}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-fg-muted">
                  <Clock size={14} /> Time Slot
                </p>
                <p className="mt-1 text-fg">{orderDetails?.time}</p>
              </div>
              <div className="col-span-2">
                <p className="flex items-center gap-1.5 text-fg-muted">
                  <MapPin size={14} /> Address
                </p>
                <p className="mt-1 leading-6 text-fg">
                  {orderDetails?.address?.locality}, {orderDetails?.address?.place}, {orderDetails?.address?.state},{" "}
                  {orderDetails?.address?.country}, {orderDetails?.address?.pincode}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="space-y-5">
          <h2 className="text-lg font-semibold text-fg font-display">Order Summary</h2>
          <div className="flex items-center justify-between text-sm">
            <p className="text-fg-muted">Order ID</p>
            <p className="font-medium text-fg">#{orderDetails?.orderId}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-fg-muted">Customer Name</p>
            <p className="font-medium text-fg">{orderDetails?.user?.name}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-fg-muted">Status</p>
            <Badge variant={STATUS_VARIANT[orderDetails?.status] || "warning"}>{orderDetails?.status}</Badge>
          </div>

          {orderDetails?.employee && (
            <div className="rounded-2xl bg-primary-50 p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-fg">
                <HardHat size={14} /> Committed Employee
              </h3>
              <p className="mt-1 text-fg">{orderDetails?.employee?.name}</p>
              <p className="text-sm text-fg-muted">{orderDetails?.category?.name} specialist</p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <h3 className="font-medium text-fg-muted">Total Amount</h3>
            <p className="text-lg font-bold text-fg">${orderDetails?.totalAmount?.toFixed(2)}</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrderView;
