/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const Tabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-1 rounded-full bg-slate-100 p-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full bg-white shadow-soft"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? "text-primary" : "text-fg-muted"}`}>
              {Icon && <Icon size={16} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
