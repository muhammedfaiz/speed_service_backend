import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, LogOut, User as UserIcon, LayoutDashboard, Wrench, ListChecks, ClipboardList, History, Zap } from "lucide-react";
import { logout } from "../../features/employeeSlice";
import { useNotificationContext } from "../../context/NotificationContext";
import Drawer from "../ui/Drawer";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Dashboard", to: "/employee/dashboard" },
  { label: "Services", to: "/employee/services" },
  { label: "Tasks", to: "/employee/tasks" },
  { label: "Requests", to: "/employee/requests" },
  { label: "History", to: "/employee/history" },
];

const MOBILE_ICONS = { Dashboard: LayoutDashboard, Services: Wrench, Tasks: ListChecks, Requests: ClipboardList, History: History };

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-primary-50 text-primary" : "text-fg-muted hover:text-fg hover:bg-slate-100"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
    isActive ? "bg-primary-50 text-primary" : "text-fg-muted hover:bg-slate-100"
  }`;

const Navbar = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { employee } = useSelector((store) => store.employee);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeNotifications } = useNotificationContext();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/employee/login");
  };

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 glass shadow-glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/employee/dashboard" className="flex items-center gap-2 text-lg font-bold text-fg font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
            <Zap size={18} className="text-white" fill="currentColor" />
          </span>
          <span className="hidden sm:inline">Speed Service</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileMenuOpen(false);
              }}
              aria-label="Notifications"
              className="relative rounded-full p-2.5 text-fg-muted transition-colors hover:bg-slate-100 hover:text-fg"
            >
              <Bell size={20} />
              {employeeNotifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {employeeNotifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-100 bg-card p-4 shadow-elevated sm:w-80"
                >
                  <h3 className="text-sm font-semibold text-fg font-display">Notifications</h3>
                  <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                    {employeeNotifications.length > 0 ? (
                      employeeNotifications.map((notification, index) => (
                        <li key={index} className="rounded-xl bg-slate-50 p-3 text-sm text-fg">
                          {notification}
                        </li>
                      ))
                    ) : (
                      <li className="py-4 text-center text-sm text-fg-muted">No new notifications</li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center justify-center rounded-full transition-transform hover:scale-105"
            >
              {employee ? (
                <Avatar name={employee.name} size="sm" ring />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-fg-muted">
                  <UserIcon size={18} />
                </span>
              )}
            </button>

            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-card p-1.5 shadow-elevated"
                >
                  {employee ? (
                    <>
                      <NavLink
                        to="/employee/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-slate-100"
                      >
                        <UserIcon size={16} /> Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/employee/login"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-slate-100"
                    >
                      Login
                    </NavLink>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2.5 text-fg-muted transition-colors hover:bg-slate-100 hover:text-fg md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Menu">
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = MOBILE_ICONS[link.label];
            return (
              <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                <Icon size={18} /> {link.label}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          {employee ? (
            <Button variant="danger" icon={LogOut} className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button to="/employee/login" className="w-full" onClick={() => setIsOpen(false)}>
              Login
            </Button>
          )}
        </div>
      </Drawer>
    </motion.nav>
  );
};

export default Navbar;
