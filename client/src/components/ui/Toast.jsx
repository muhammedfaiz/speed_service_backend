import { toast } from "react-toastify";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const baseOptions = {
  className: "!rounded-2xl !shadow-elevated !font-sans !text-sm",
  autoClose: 3500,
};

export const showSuccessToast = (message) =>
  toast.success(message, { ...baseOptions, icon: <CheckCircle2 className="text-accent-600" size={20} /> });

export const showErrorToast = (message) =>
  toast.error(message, { ...baseOptions, icon: <XCircle className="text-red-600" size={20} /> });

export const showInfoToast = (message) =>
  toast.info(message, { ...baseOptions, icon: <Info className="text-secondary" size={20} /> });
