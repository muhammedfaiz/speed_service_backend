import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, User as UserIcon } from "lucide-react";
import { adminLogout } from "../../features/adminSlice";
import Avatar from "../ui/Avatar";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { admin } = useSelector((store) => store.admin);

  const handleLogout = () => {
    dispatch(adminLogout());
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full transition-transform hover:scale-105">
        <Avatar name={admin?.name} size="sm" ring />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-card p-1.5 shadow-elevated"
          >
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-fg-muted">
              <UserIcon size={14} /> {admin?.name || "Admin"}
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
