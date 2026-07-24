import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { changeEmployeeStatus, fetchEmployee } from "../../services/adminService";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";

const EmployeeList = () => {
  const [search, setSearch] = useState("");
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  useEffect(() => {
    async function getEmployee() {
      try {
        const data = await fetchEmployee();
        setEmployee(data.data);
        setFilteredEmployee(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getEmployee();
  }, [isChanged]);

  function handleSearch(value) {
    setSearch(value);
    if (value === "") {
      setFilteredEmployee(employee);
      return;
    }
    const result = employee.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredEmployee(result);
    setCurrentPage(1);
  }

  async function handleStatus(id, status) {
    try {
      const res = await changeEmployeeStatus(id, status);
      setIsChanged(!isChanged);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployee.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployee.length / employeesPerPage);

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "designation", header: "Designation" },
    { key: "experience", header: "Experience" },
    { key: "joined", header: "Joined At" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <button onClick={() => handleStatus(item.id, item.status === "active" ? "blocked" : "active")}>
          <Badge variant={item.status === "active" ? "accent" : "danger"}>{item.status}</Badge>
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Employee" subtitle="Manage employee.">
      <Card hoverable={false} padding="none">
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
            />
          </div>
        </div>
        <div className="px-6 pb-6">
          <Table columns={columns} data={currentEmployees} rowKey="id" emptyTitle="No employees found" />
          <div className="mt-4 flex justify-end">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default EmployeeList;
