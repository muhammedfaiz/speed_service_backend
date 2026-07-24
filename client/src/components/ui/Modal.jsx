import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`relative w-full ${SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-elevated`}
          >
            {(title || onClose) && (
              <div className="mb-4 flex items-center justify-between">
                {title && <h3 className="text-lg font-semibold font-display">{title}</h3>}
                {onClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-full p-1.5 text-fg-muted hover:bg-slate-100 hover:text-fg transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
