/* eslint-disable react/prop-types */
const VARIANT_CLASSES = {
  text: "rounded-md",
  circle: "rounded-full",
  rect: "rounded-2xl",
};

const Skeleton = ({ variant = "text", width, height, className = "" }) => {
  return (
    <div
      className={`animate-shimmer bg-shimmer ${VARIANT_CLASSES[variant]} ${className}`}
      style={{ width, height: height || (variant === "text" ? "1em" : undefined) }}
    />
  );
};

export default Skeleton;
