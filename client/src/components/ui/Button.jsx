/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  primary:
    "bg-primary text-white shadow-soft hover:bg-primary-700 focus-visible:ring-primary-200",
  secondary:
    "bg-secondary text-white shadow-soft hover:bg-secondary-600 focus-visible:ring-secondary-100",
  outline:
    "bg-white text-primary border border-primary/30 hover:bg-primary-50 focus-visible:ring-primary-100",
  ghost:
    "bg-transparent text-fg hover:bg-slate-100 focus-visible:ring-slate-200",
  danger:
    "bg-red-600 text-white shadow-soft hover:bg-red-700 focus-visible:ring-red-200",
};

const SIZE_CLASSES = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-base px-7 py-3.5 gap-2.5",
};

const Button = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  to,
  href,
  className = "",
  children,
  ...rest
}) => {
  const classes = `group inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  const content = (
    <>
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon &&
        iconPosition === "left" && (
          <Icon size={18} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        )
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  const motionProps = {
    whileHover: disabled || loading ? {} : { scale: 1.03, y: -1 },
    whileTap: disabled || loading ? {} : { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
  };

  if (to) {
    return (
      <motion.div className="inline-block" {...motionProps}>
        <Link to={to} className={classes} {...rest}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...rest}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  );
};

export default Button;
