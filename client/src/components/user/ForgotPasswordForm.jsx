import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    } else if (email && !/^\S+@\S+\.\S+$/i.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    } else {
      setErrors({});
      setLoading(true);
      try {
        let response = await userService.forgotPasswordService({ email });
        if (response.status == 200) {
          toast.success("Password reset link is successfully sent to mail");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card hoverable={false} padding="lg" className="!rounded-3xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <KeyRound size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Forgot password?</h1>
      <p className="mt-1.5 text-sm text-fg-muted">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Email address"
          icon={Mail}
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Send reset link
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg"
      >
        <ArrowLeft size={15} /> Back to login
      </Link>
    </Card>
  );
};
export default ForgotPasswordForm;
