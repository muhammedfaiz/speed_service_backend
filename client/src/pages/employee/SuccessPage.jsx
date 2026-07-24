import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const SuccessPage = () => {
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
        <h1 className="mt-6 text-2xl font-bold text-fg font-display">Application Submitted!</h1>
        <p className="mt-3 text-fg-muted">
          Thank you for applying. We&apos;ll review your application and get back to you soon.
        </p>
        <Button to="/" size="lg" className="mt-8 w-full">
          Go to Home
        </Button>
      </Card>
    </div>
  );
};

export default SuccessPage;
