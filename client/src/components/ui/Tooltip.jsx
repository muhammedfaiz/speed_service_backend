/* eslint-disable react/prop-types */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SIDE_CLASSES = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const SIDE_OFFSET = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
};

const Tooltip = ({ content, children, side = "top", delay = 150 }) => {
  const [visible, setVisible] = useState(false);
  let timer;

  const show = () => {
    timer = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    clearTimeout(timer);
    setVisible(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, ...SIDE_OFFSET[side] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...SIDE_OFFSET[side] }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 whitespace-nowrap rounded-lg bg-fg px-2.5 py-1.5 text-xs font-medium text-white shadow-elevated ${SIDE_CLASSES[side]}`}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;
