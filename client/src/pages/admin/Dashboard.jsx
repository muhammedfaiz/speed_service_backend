import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { DollarSign, ShoppingBag, ShoppingCart } from "lucide-react";
import { getDashboardDataService, getOrdersService } from "../../services/adminService";
import "chart.js/auto";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";

const chartOptions = (color) => ({
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#94A3B8", font: { size: 11 } } },
    y: { grid: { color: "#F1F5F9" }, ticks: { color: "#94A3B8", font: { size: 11 } } },
  },
  elements: {
    line: { borderColor: color, borderWidth: 2, tension: 0.35 },
    point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: color, hoverBorderColor: "#fff", hoverBorderWidth: 2 },
  },
});

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchDashboardData = async () => {
      const data = await getDashboardDataService();
      setDashboardData(data);
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      const data = await getOrdersService();
      setOrders(data.orders);
    };
    fetchRecentOrders();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentOrders = orders.slice(indexOfFirstRow, indexOfLastRow);

  const salesData = {
    labels: dashboardData?.sales?.map((sale) => sale.day),
    datasets: [
      {
        label: "Sales Revenue",
        data: dashboardData?.sales?.map((sale) => sale.revenue),
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        fill: true,
      },
    ],
  };

  const ordersData = {
    labels: dashboardData?.orders?.map((order) => order.day),
    datasets: [
      {
        label: "Total Orders",
        data: dashboardData?.orders?.map((order) => order.count),
        backgroundColor: "rgba(14, 165, 233, 0.08)",
        fill: true,
      },
    ],
  };

  const columns = [
    { key: "orderId", header: "Order ID" },
    { key: "customer", header: "Customer", render: (row) => row.user.name },
    { key: "services", header: "Services", render: (row) => row.orderItems.map((item) => item.item.name).join(", ") },
    { key: "status", header: "Status" },
    { key: "date", header: "Date", render: (row) => new Date(row.createdAt).toDateString() },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your business performance">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <DollarSign size={22} />
          </span>
          <div>
            <p className="text-sm text-fg-muted">Total Revenue</p>
            <p className="text-2xl font-bold text-fg font-display">${dashboardData?.totalRevenue}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <ShoppingBag size={22} />
          </span>
          <div>
            <p className="text-sm text-fg-muted">Total Sales</p>
            <p className="text-2xl font-bold text-fg font-display">{dashboardData?.totalSales}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary">
            <ShoppingCart size={22} />
          </span>
          <div>
            <p className="text-sm text-fg-muted">Total Orders</p>
            <p className="text-2xl font-bold text-fg font-display">{dashboardData?.totalOrders}</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card hoverable={false}>
          <h3 className="mb-4 font-semibold text-fg font-display">Sales Revenue</h3>
          <Line data={salesData} options={chartOptions("#2563EB")} />
        </Card>
        <Card hoverable={false}>
          <h3 className="mb-4 font-semibold text-fg font-display">Total Orders</h3>
          <Line data={ordersData} options={chartOptions("#0EA5E9")} />
        </Card>
      </div>

      <Card hoverable={false} padding="none" className="mt-6">
        <h3 className="p-6 pb-0 font-semibold text-fg font-display">Recent Orders</h3>
        <div className="p-6">
          <Table columns={columns} data={currentOrders} rowKey="orderId" emptyTitle="No orders yet" />
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(orders.length / rowsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
