/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <nav className={`flex items-center flex-wrap gap-1.5 text-sm ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.to && !isLast ? (
              <Link to={item.to} className="text-fg-muted hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-fg" : "text-fg-muted"}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className="text-fg-subtle" />}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
