/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title, description, action, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-fg-subtle">
        <Icon size={26} />
      </span>
      <h3 className="text-base font-semibold text-fg font-display">{title}</h3>
      {description && <p className="max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
