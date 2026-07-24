/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Sparkles, Zap } from "lucide-react";

const AuthLayout = ({ children, heading = "Home services you can trust", subheading = "Book verified professionals in minutes and manage everything in one place." }) => {
  return (
    <div className="relative flex min-h-screen bg-surface">
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden gradient-brand p-16 lg:flex">
        <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob-delay" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md text-white"
        >
          <Link to="/" className="flex items-center gap-2 text-lg font-bold font-display">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Zap size={18} fill="currentColor" />
            </span>
            Speed Service
          </Link>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="my-12 flex h-40 w-40 items-center justify-center rounded-[2rem] bg-white/15 backdrop-blur-sm"
          >
            <ShieldCheck size={72} strokeWidth={1.4} />
          </motion.div>

          <h2 className="text-3xl font-bold leading-tight font-display">{heading}</h2>
          <p className="mt-4 text-white/80">{subheading}</p>

          <div className="mt-10 flex items-center gap-2 text-sm text-white/80">
            <Sparkles size={16} /> Trusted by 5000+ happy customers
          </div>
        </motion.div>
      </div>

      <div className="relative flex w-full items-center justify-center overflow-hidden p-6 sm:p-10 lg:w-1/2">
        <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg lg:hidden"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
