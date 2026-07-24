import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { changeUserStatus, fetchUsers } from "../../services/adminService";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";

const UserList = () => {
  const [data, setData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers();
        setData(response);
        setFilteredUsers(response);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getUsers();
  }, [fetchTrigger]);

  const handleSearch = (value) => {
    setSearch(value);
    if (value === "") {
      setFilteredUsers(data);
    } else {
      const users = data.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(users);
    }
    setCurrentPage(1);
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await changeUserStatus({ userId, status });
      toast.success("User status changed!");
      setFetchTrigger((prevState) => prevState + 1);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const columns = [
    { key: "name", header: "User" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "createdAt", header: "Created at" },
    {
      key: "status",
      header: "Status",
      render: (user) => (
        <button onClick={() => handleStatusChange(user._id, !user.status)}>
          <Badge variant={user.status ? "accent" : "danger"}>{user.status ? "Active" : "Blocked"}</Badge>
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Users" subtitle="Manage your customers.">
      <Card hoverable={false} padding="none">
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
            />
          </div>
        </div>
        <div className="px-6 pb-6">
          <Table columns={columns} data={currentUsers} rowKey="_id" emptyTitle="No users found" />
          <div className="mt-4 flex justify-end">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default UserList;
