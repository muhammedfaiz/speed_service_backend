import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import Application from "../../components/employee/Applicatoin";

const ApplicationPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface py-12">
      <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        <Link to="/" className="mb-8 flex items-center gap-2 text-lg font-bold text-fg font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
            <Zap size={18} className="text-white" fill="currentColor" />
          </span>
          Speed Service
        </Link>
        <Application />
      </div>
    </div>
  );
};
export default ApplicationPage;
