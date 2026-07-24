/* eslint-disable react/prop-types */
const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Avatar = ({ src, alt = "", name = "", size = "md", ring = false, className = "" }) => {
  const base = `inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden font-semibold ${SIZE_CLASSES[size]} ${
    ring ? "ring-2 ring-white shadow-soft" : ""
  } ${className}`;

  if (src) {
    return <img src={src} alt={alt || name} className={`${base} object-cover`} />;
  }

  return (
    <span className={`${base} bg-gradient-to-br from-primary to-secondary text-white`}>
      {getInitials(name) || "?"}
    </span>
  );
};

export default Avatar;
