import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Star, SearchX } from "lucide-react";
import Footer from "../../components/user/Footer";
import Navbar from "../../components/user/Navbar";
import userService from "../../services/userService";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";

const ITEMS_PER_PAGE = 8;

const selectClass =
  "w-full md:w-56 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50";

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await userService.fetchServices();
        setServices(data.services);
        setFilteredServices(data.services);

        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get("category");
        if (category) {
          setCategoryFilter(category);
          filterServices(search, category);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    filterServices(e.target.value, categoryFilter);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    filterServices(search, e.target.value);
  };

  const filterServices = (searchTerm, category) => {
    if (searchTerm === "" && category === "") {
      setFilteredServices(services);
      return;
    }
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === "" || service.category.name === category)
    );
    setFilteredServices(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const currentServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-fg font-display sm:text-4xl">Our Services</h1>
          <p className="mt-2 text-fg-muted">Find the right professional for the job.</p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
          <div className="relative w-full md:w-80">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search services..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
            />
          </div>
          <select value={categoryFilter} onChange={handleCategoryFilter} className={selectClass}>
            <option value="">All Categories</option>
            {Array.from(new Set(services.map((service) => service.category.name))).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton variant="rect" className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : currentServices.length === 0 ? (
          <EmptyState icon={SearchX} title="No services found" description="Try a different search term or category." />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentServices.map((service) => (
              <Link key={service._id} to={`/service/${service._id}`}>
                <Card padding="none" className="h-full overflow-hidden">
                  <img className="h-48 w-full object-cover" src={service.imageUrl} alt={service.name} />
                  <div className="p-4">
                    <h3 className="truncate font-semibold text-fg">{service.name}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{service.category.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="font-semibold text-fg">${service.price}</p>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" strokeWidth={0} />
                        <span className="text-sm font-medium text-fg">
                          {service.rating ? `${service.rating}.0` : "5.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ServiceListPage;
