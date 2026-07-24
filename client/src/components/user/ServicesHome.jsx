import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import userService from "../../services/userService";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ServicesHome = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await userService.fetchServices();
        const sortedServices = data.services.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const maxServicesToShow = 3 * 4;
        setServices(sortedServices.slice(0, maxServicesToShow));
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl font-bold text-fg font-display sm:text-3xl">Services</h2>
        <p className="mt-2 text-fg-muted">Choose the service you prefer.</p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton variant="rect" className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div key={service._id} variants={fadeUp}>
              <Card padding="none" className="h-full overflow-hidden">
                <Link to={`/service/${service._id}`}>
                  <img className="h-48 w-full object-cover" src={service.imageUrl} alt={service.name} />
                </Link>
                <div className="p-4">
                  <Link to={`/service/${service._id}`}>
                    <h3 className="truncate text-lg font-semibold text-fg">{service.name}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-fg-muted">{service.category.name}</p>
                  <div className="mt-2.5 flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" strokeWidth={0} />
                    <span className="text-sm font-medium text-fg">
                      {service.rating ? `${service.rating}.0` : "5.0"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-base font-semibold text-fg">${service.price}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default ServicesHome;
