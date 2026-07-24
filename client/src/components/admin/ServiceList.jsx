import { useState, useEffect } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { deleteService, getAllServices } from "../../services/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Table from "../ui/Table";
import Pagination from "../ui/Pagination";
import Button from "../ui/Button";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");
  const [change, setChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        setServices(response.services);
        setFilteredServices(response.services);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, [change]);

  const handleSearchChange = (value) => {
    setSearch(value);
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(value.toLowerCase()) ||
        service.category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteService(id);
      if (result.status === 200) {
        toast.success("Service deleted!");
        setChange(!change);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const columns = [
    {
      key: "name",
      header: "Service",
      render: (service) => (
        <div className="flex items-center gap-3">
          <img src={service.imageUrl} alt={service.name} className="h-10 w-10 rounded-xl object-cover" />
          <span>{service.name}</span>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (service) => service.category.name },
    { key: "price", header: "Price", render: (service) => `$${service.price}` },
    { key: "description", header: "Description", render: (service) => <span className="line-clamp-1 max-w-xs">{service.description}</span> },
    {
      key: "actions",
      header: "",
      render: (service) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={Pencil} onClick={() => navigate(`/admin/edit-service/${service._id}`)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(service._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="relative mb-6 w-full sm:w-72">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search services"
          className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
        />
      </div>
      <Table columns={columns} data={currentServices} rowKey="_id" emptyTitle="No services found" />
      <div className="mt-4 flex justify-end">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ServiceList;
