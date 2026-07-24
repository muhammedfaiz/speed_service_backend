import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Dashboard", to: "/employee/dashboard" },
  { label: "Services", to: "/services" },
  { label: "Privacy Policy", to: "" },
  { label: "Terms & Conditions", to: "" },
];

const Footer = () => {
  return (
    <footer className="mt-20 bg-fg px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6">
        <Link to="/employee/dashboard" className="flex items-center gap-2 text-lg font-bold text-white font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
            <Zap size={18} className="text-white" fill="currentColor" />
          </span>
          Speed Service
        </Link>
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Speed Service. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
