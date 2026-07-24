import { useEffect, useState } from "react";
import { Search, Check, X } from "lucide-react";
import { acceptApplication, getApplications, rejectApplication } from "../../services/adminService";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getApplications();
        setApplications(response.applications);
        setFilteredApplications(response.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [fetchTrigger]);

  async function handleAccept(id) {
    try {
      const response = await acceptApplication(id);
      if (response.status === 200) {
        toast.success(response.data.message);
        setFetchTrigger((prevState) => prevState + 1);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleReject(id) {
    try {
      const response = await rejectApplication(id);
      if (response.status === 200) {
        toast.success(response.data.message);
        setFetchTrigger((prevState) => prevState + 1);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleSearch(value) {
    setSearch(value);
    if (value === "") {
      setFilteredApplications(applications);
    } else {
      const data = applications.filter(
        (application) =>
          application.name.toLowerCase().includes(value.toLowerCase()) ||
          application.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredApplications(data);
    }
    setCurrentPage(1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const columns = [
    {
      key: "name",
      header: "Applicant",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar name={item.name} size="sm" />
          <span>{item.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "designation", header: "Designation", render: (item) => item.designation.name },
    { key: "experience", header: "Experience" },
    {
      key: "proof",
      header: "Proof",
      render: (item) => (
        <a href={item.proofUrl} target="_blank" rel="noopener noreferrer">
          <img src={item.proofUrl} alt="proof" className="h-10 w-10 rounded-lg object-cover" />
        </a>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <div className="flex gap-2">
          <Button size="sm" icon={Check} onClick={() => handleAccept(item._id)}>
            Accept
          </Button>
          <Button size="sm" variant="danger" icon={X} onClick={() => handleReject(item._id)}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Applicants" subtitle="Manage employee applications.">
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
          <Table columns={columns} data={currentItems} rowKey="_id" emptyTitle="No applications found" />
          <div className="mt-4 flex justify-end">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default ApplicationList;
