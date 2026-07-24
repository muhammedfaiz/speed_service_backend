import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, ShoppingCart, Download, CalendarRange } from "lucide-react";
import { salesDataService } from "../../services/adminService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";

const datePickerClass =
  "w-full sm:w-40 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50";

const SalesReport = () => {
  const [salesData, setSalesData] = useState({});
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchSalesData = async () => {
      const data = await salesDataService();
      setSalesData(data.salesData);
      setFilteredSalesData(data.salesData.salesPerDay);

      if (data.salesData.salesPerDay?.length > 0) {
        const firstOrderDate = new Date(data.salesData.salesPerDay[0].day);
        const lastOrderDate = new Date(data.salesData.salesPerDay[data.salesData.salesPerDay.length - 1].day);
        lastOrderDate.setHours(23, 59, 59, 999);
        setMinDate(firstOrderDate);
        setMaxDate(lastOrderDate);
      }
    };
    fetchSalesData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString().split("T")[0];
      const end = new Date(endDate).toISOString().split("T")[0];
      const filtered = salesData?.salesPerDay?.filter((data) => {
        const date = data.day;
        return date >= start && date <= end;
      });
      setFilteredSalesData(filtered);
    } else {
      setFilteredSalesData(salesData?.salesPerDay);
    }
  }, [startDate, endDate, salesData]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSalesData?.slice(indexOfFirstRow, indexOfLastRow);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "SalesReport.xlsx");
  };

  const columns = [
    { key: "day", header: "Date" },
    { key: "totalSales", header: "Total Sales" },
    { key: "totalOrders", header: "Total Orders" },
    { key: "totalRevenue", header: "Total Revenue", render: (row) => `$${row.totalRevenue}` },
  ];

  return (
    <AdminLayout title="Sales Report" subtitle="Overview of recent sales.">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <CalendarRange size={18} className="text-fg-subtle" />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Start Date"
          className={datePickerClass}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || minDate}
          placeholderText="End Date"
          className={datePickerClass}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <DollarSign size={22} />
          </span>
          <div>
            <p className="text-sm text-fg-muted">Total Revenue</p>
            <p className="text-2xl font-bold text-fg font-display">${salesData?.totalRevenue}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <ShoppingBag size={22} />
          </span>
          <div>
            <p className="text-sm text-fg-muted">Total Sales</p>
            <p className="text-2xl font-bold text-fg font-display">{salesData?.totalSales}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary">
            <ShoppingCart size={22} />
          </span>
          <div>
            <p className="text-sm text-fg-muted">Total Orders</p>
            <p className="text-2xl font-bold text-fg font-display">{salesData?.totalOrders}</p>
          </div>
        </Card>
      </div>

      <Card hoverable={false} padding="none">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="font-semibold text-fg font-display">Sales Details</h3>
          <Button size="sm" icon={Download} onClick={exportToExcel}>
            Download Report
          </Button>
        </div>
        <div className="p-6">
          <Table columns={columns} data={currentRows || []} rowKey="day" emptyTitle="No sales data" />
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((filteredSalesData?.length || 0) / rowsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default SalesReport;
