import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { login } from "../../features/userSlice";
import { toast } from "react-toastify";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isSuccess, loading } = useSelector((store) => store.user);

  function validation() {
    let errors = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (email && !/^\S+@\S+\.\S+$/i.test(email)) {
      errors.email = "Invalid email format";
    }
    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    return errors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validation();
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    } else {
      setErrors({});
      dispatch(login({ email, password }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Login failed");
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <Card hoverable={false} padding="lg" className="!rounded-3xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <LogIn size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Welcome back</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Log in to manage your bookings and profile.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Email address"
          type="text"
          icon={Mail}
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-700">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Login
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-fg-muted">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-primary hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </Card>
  );
};

export default Login;
