/* eslint-disable react/prop-types */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ label, type = "text", icon: Icon, error, dark = false, className = "", ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={className}>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-fg-subtle"}`}
          />
        )}
        <input
          type={inputType}
          placeholder=" "
          className={`peer w-full rounded-xl border pb-2.5 pt-7 text-sm shadow-soft outline-none transition-colors focus:ring-4 ${
            Icon ? "pl-11" : "pl-4"
          } ${isPassword ? "pr-11" : "pr-4"} ${
            dark
              ? `bg-white/5 text-white ${error ? "border-red-400/60 focus:ring-red-500/10" : "border-white/10 focus:border-primary/60 focus:ring-primary/10"}`
              : `bg-white text-fg ${error ? "border-red-300 focus:border-red-400 focus:ring-red-50" : "border-slate-200 focus:border-primary/50 focus:ring-primary-50"}`
          }`}
          {...rest}
        />
        <label
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm leading-none transition-all duration-150 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-[&:not(:placeholder-shown)]:top-2.5 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[11px] ${
            dark ? "text-slate-500 peer-focus:text-primary-200" : "text-fg-subtle peer-focus:text-primary"
          } ${Icon ? "left-11" : "left-4"}`}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((s) => !s)}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              dark ? "text-slate-500 hover:text-slate-300" : "text-fg-subtle hover:text-fg"
            }`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className={`mt-1.5 text-xs ${dark ? "text-red-400" : "text-red-500"}`}>{error}</p>}
    </div>
  );
};

export default Input;
