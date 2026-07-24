/* eslint-disable react/prop-types */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-slate-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 py-5 text-left"
      aria-expanded={isOpen}
    >
      <span className="font-medium text-fg">{item.question}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="shrink-0 rounded-full bg-slate-100 p-1.5 text-fg-muted"
      >
        <ChevronDown size={16} />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="pb-5 pr-8 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Accordion = ({ items, allowMultiple = false, className = "" }) => {
  const [openIds, setOpenIds] = useState([]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) {
        return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={`rounded-2xl border border-slate-100 bg-card px-6 shadow-soft ${className}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
};

export default Accordion;
