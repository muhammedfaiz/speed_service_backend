import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search, Pencil, Trash2 } from "lucide-react";
import { deleteCategoryService, getCategoriesService } from "../../services/adminService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Table from "../ui/Table";
import Pagination from "../ui/Pagination";
import Button from "../ui/Button";

const CategoryList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesService();
        setData(response.categories);
        setFilteredData(response.categories);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCategories();
  }, [fetchTrigger]);

  function handleSearch(value) {
    setSearch(value);
    if (value === "") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())));
    }
    setCurrentPage(1);
  }

  async function handleDelete(id) {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563EB",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCategoryService(id);
          setFilteredData(filteredData.filter((category) => category._id !== id));
          setFetchTrigger(!fetchTrigger);
          toast.success("Category deleted");
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredData.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredData.length / categoriesPerPage);

  const columns = [
    {
      key: "name",
      header: "Category",
      render: (category) => (
        <div className="flex items-center gap-3">
          <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-xl object-cover" />
          <span>{category.name}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (category) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={Pencil} onClick={() => navigate(`/admin/edit-category/${category._id}`)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(category._id)}>
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
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name"
          className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
        />
      </div>
      <Table columns={columns} data={currentCategories} rowKey="_id" emptyTitle="No categories found" />
      <div className="mt-4 flex justify-end">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default CategoryList;
