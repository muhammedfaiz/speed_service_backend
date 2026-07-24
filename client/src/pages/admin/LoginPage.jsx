import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import AdminLogin from "../../components/admin/AdminLogin";

const LoginPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-fg px-4 py-12">
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-blob-delay" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[length:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        <div className="mb-8 flex items-center gap-2.5 text-2xl font-bold text-white font-display">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand">
            <Zap size={24} className="text-white" fill="currentColor" />
          </span>
          Speed Service
        </div>
        <AdminLogin />
      </motion.div>
    </div>
  );
};
export default LoginPage;
