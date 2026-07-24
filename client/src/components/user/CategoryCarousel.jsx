import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService.js";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const CategoryCarousel = () => {
  const carouselRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await userService.getCategories();
        setCategories(response.categories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/services?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fg font-display sm:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-fg-muted">Find the right expert for the job.</p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-fg-muted transition-colors hover:bg-slate-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-fg-muted transition-colors hover:bg-slate-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex gap-5 overflow-x-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-44 w-48 flex-shrink-0" />
          ))}
        </div>
      ) : (
        <motion.div
          ref={carouselRef}
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <motion.div key={category._id} variants={fadeUp} className="w-48 flex-shrink-0">
              <Card
                hoverable
                padding="none"
                className="cursor-pointer overflow-hidden"
                onClick={() => handleCategoryClick(category.name)}
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-32 w-full object-cover"
                />
                <h3 className="px-4 py-3 text-center text-base font-semibold text-fg">{category.name}</h3>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default CategoryCarousel;
