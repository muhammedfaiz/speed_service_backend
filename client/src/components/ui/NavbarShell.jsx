/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const NavbarShell = ({ logo, links, rightSlot, mobileToggle, className = "" }) => {
  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 glass shadow-glass ${className}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          {logo}
          <div className="hidden md:flex items-center gap-1">{links}</div>
        </div>
        <div className="flex items-center gap-2">
          {rightSlot}
          <div className="md:hidden">{mobileToggle}</div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavbarShell;
