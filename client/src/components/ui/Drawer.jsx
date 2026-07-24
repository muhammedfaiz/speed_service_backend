import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Drawer = ({ isOpen, onClose, side = "right", title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isLeft = side === "left";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: isLeft ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} h-full w-full max-w-xs bg-card shadow-elevated flex flex-col`}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              {title && <h3 className="text-base font-semibold font-display">{title}</h3>}
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-auto rounded-full p-1.5 text-fg-muted hover:bg-slate-100 hover:text-fg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Drawer;
