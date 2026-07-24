/* eslint-disable react/prop-types */
const VARIANT_CLASSES = {
  primary: "bg-primary-50 text-primary-700",
  secondary: "bg-secondary-50 text-secondary-600",
  accent: "bg-accent-50 text-accent-700",
  neutral: "bg-slate-100 text-slate-600",
  outline: "bg-white text-fg-muted border border-slate-200",
  danger: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-600",
};

const SIZE_CLASSES = {
  sm: "text-xs px-2.5 py-1 gap-1",
  md: "text-sm px-3 py-1.5 gap-1.5",
};

const Badge = ({
  variant = "neutral",
  size = "sm",
  icon: Icon,
  className = "",
  children,
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 12 : 14} />}
      {children}
    </span>
  );
};

export default Badge;
