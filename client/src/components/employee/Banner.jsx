import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, ListChecks } from "lucide-react";
import Button from "../ui/Button";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden gradient-brand">
      <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob-delay" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8"
      >
        <h1 className="text-3xl font-bold text-white font-display sm:text-5xl">Welcome back!</h1>
        <p className="max-w-lg text-white/85">Manage your bookings, requests, and tasks all in one place.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="!bg-white !text-primary-700"
            icon={ClipboardList}
            onClick={() => navigate("/employee/requests")}
          >
            Show Requests
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20"
            icon={ListChecks}
            onClick={() => navigate("/employee/tasks")}
          >
            Show Tasks
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;
