import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { getOrdersService } from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrdersService();
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    };
    fetchOrders();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim() !== "") {
      const filtered = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(value.toLowerCase()) ||
          order.user.name.toLowerCase().includes(value.toLowerCase()) ||
          order.category.name.toLowerCase().includes(value.toLowerCase()) ||
          order.employee?.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const columns = [
    { key: "orderId", header: "Order" },
    { key: "items", header: "Items", render: (order) => order.orderItems.map((item) => item.item?.name).join(", ") },
    { key: "category", header: "Category", render: (order) => order.category.name },
    { key: "user", header: "User", render: (order) => order.user.name },
    { key: "employee", header: "Employee", render: (order) => order?.employee?.name || "No employee assigned" },
    { key: "totalAmount", header: "Total amount", render: (order) => `$${order.totalAmount}` },
    {
      key: "actions",
      header: "",
      render: (order) => (
        <Button to={`/admin/order/${order._id}`} size="sm" variant="outline" icon={Eye}>
          View
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout title="Orders" subtitle="List of orders done are shown.">
      <Card hoverable={false} padding="none">
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
            />
          </div>
        </div>
        <div className="px-6 pb-6">
          <Table columns={columns} data={currentItems} rowKey="_id" emptyTitle="No orders found" />
          <div className="mt-4 flex justify-end">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default OrdersListPage;
