/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { LayoutDashboard, HardHat, UserPlus, Tags, Package, ShoppingCart, Users, BarChart3 } from "lucide-react";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/employee", label: "Employee", icon: HardHat },
  { to: "/admin/applicants", label: "Applicants", icon: UserPlus },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/services", label: "Services", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/sales-report", label: "Sales Report", icon: BarChart3 },
];

const Navbar = ({ onNavigate, light = false }) => {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-4">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              light
                ? isActive
                  ? "bg-primary-50 text-primary"
                  : "text-fg-muted hover:bg-slate-100 hover:text-fg"
                : isActive
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <link.icon size={18} /> {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
