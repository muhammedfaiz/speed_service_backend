/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const PADDING_CLASSES = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = ({
  children,
  hoverable = true,
  padding = "md",
  className = "",
  as: Component = motion.div,
  ...rest
}) => {
  return (
    <Component
      className={`bg-card rounded-2xl border border-slate-100 shadow-soft transition-shadow duration-300 ${
        hoverable ? "hover:shadow-elevated" : ""
      } ${PADDING_CLASSES[padding]} ${className}`}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Card;
