import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { adminLogin } from "../../features/adminSlice";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { error, isSuccess, admin, loading } = useSelector((store) => store.admin);
  const navigate = useNavigate();

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
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
      dispatch(adminLogin({ email, password }));
    }
  };

  useEffect(() => {
    if (isSuccess && admin) {
      navigate("/admin/dashboard");
    }
  }, [isSuccess, navigate, admin]);

  return (
    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated backdrop-blur-xl sm:p-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary-200">
        <ShieldCheck size={26} />
      </span>
      <h1 className="mt-6 text-center text-2xl font-bold text-white font-display">Admin Login</h1>
      <p className="mt-1.5 text-center text-sm text-slate-400">Sign in to manage Speed Service.</p>

      {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input dark label="Email address" icon={Mail} value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          dark
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Login
        </Button>
      </form>
    </div>
  );
};
export default AdminLogin;
