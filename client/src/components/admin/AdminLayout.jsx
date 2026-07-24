/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Menu } from "lucide-react";
import Navbar from "./Navbar";
import ProfileDropdown from "./ProfileDropdown";
import Drawer from "../ui/Drawer";

const Logo = () => (
  <div className="flex items-center gap-2 px-6 py-7 text-lg font-bold text-white font-display">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
      <Zap size={18} className="text-white" fill="currentColor" />
    </span>
    Speed Service
  </div>
);

const AdminLayout = ({ title, subtitle, actions, children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-fg lg:flex">
        <Logo />
        <Navbar />
      </aside>

      <Drawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} side="left" title="Menu">
        <Navbar light onNavigate={() => setMobileNavOpen(false)} />
      </Drawer>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 glass shadow-glass">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-fg-muted hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 flex-1">
              {title && <h1 className="truncate text-xl font-bold text-fg font-display">{title}</h1>}
              {subtitle && <p className="mt-0.5 truncate text-sm text-fg-muted">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-8 sm:px-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
