import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const SuccessOrderPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card hoverable={false} padding="lg" className="max-w-md text-center !rounded-3xl">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-50 text-accent-600"
        >
          <CheckCircle2 size={44} />
        </motion.span>
        <h1 className="mt-6 text-2xl font-bold text-fg font-display">Thank you!</h1>
        <p className="mt-3 text-fg-muted">
          Your order has been successfully placed. We will contact you shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/" variant="outline" className="flex-1">
            Back to Home
          </Button>
          <Button to="/bookings" icon={ClipboardList} className="flex-1">
            Show Bookings
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default SuccessOrderPage;
