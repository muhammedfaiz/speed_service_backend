import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/employeeSlice";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, LogIn } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const EmployeeLoginForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { error, isLoggedIn } = useSelector((store) => store.employee);
  const navigate = useNavigate();

  function validate() {
    let errors = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!code) {
      errors.code = "Code is required";
    }
    if (email && !/^\S+@\S+\.\S+$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (code && code.length < 5) {
      errors.code = "Code must be 5 characters long";
    }
    return errors;
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/employee/dashboard");
    }
  }, [isLoggedIn, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
      dispatch(login({ email, code }));
    }
  }

  return (
    <Card hoverable={false} padding="lg" className="!rounded-3xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <LogIn size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Employee Login</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Log in with your email and employee code.</p>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Email address"
          icon={Mail}
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Employee code"
          type="password"
          icon={KeyRound}
          value={code}
          error={errors.code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full">
          Login
        </Button>
      </form>
    </Card>
  );
};
export default EmployeeLoginForm;
