import { useState } from "react";
import { toast } from "react-toastify";
import { Lock, ShieldCheck } from "lucide-react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

// eslint-disable-next-line react/prop-types
const ResetPasswordForm = ({ id, token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm your password";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const response = await userService.ResetPassword({ id, token, password });
      if (response.status === 200) {
        toast.success("Password has been reset successfully");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error) {
        toast.error(error);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hoverable={false} padding="lg" className="!rounded-3xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <ShieldCheck size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Reset password</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="New password"
          type="password"
          icon={Lock}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={Lock}
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Change password
        </Button>
      </form>
    </Card>
  );
};
export default ResetPasswordForm;
