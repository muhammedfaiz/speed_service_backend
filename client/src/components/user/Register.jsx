import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Phone, Lock, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";
import { register } from "../../features/userSlice.js";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const STEPS = ["Your Details", "Security"];

// eslint-disable-next-line react/prop-types
const Register = ({ setToggle }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess, error, loading } = useSelector((store) => store.user);

  function validateStep1() {
    let errors = {};
    if (!name) {
      errors.name = "Name is required";
    }
    if (name && !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
      errors.name = "Invalid name format";
    }
    if (!email) {
      errors.email = "Email is required";
    }
    if (email && !/^\S+@\S+\.\S+$/i.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!phone) {
      errors.phone = "Phone number is required";
    }
    if (phone && !/^\d{10}$/.test(Number(phone))) {
      errors.phone = "Invalid phone number format";
    }
    return errors;
  }

  function validateStep2() {
    let errors = {};
    if (!password) {
      errors.password = "Password is required";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    }
    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password do not match";
    }
    return errors;
  }

  function handleNext(e) {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
      dispatch(register({ name, email, phone, password }));
      setToggle(true);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [user, isSuccess, navigate, error]);

  return (
    <Card hoverable={false} padding="lg" className="!rounded-3xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <UserPlus size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Create your account</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Join thousands booking trusted home services.</p>

      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full gradient-brand"
                initial={{ width: 0 }}
                animate={{ width: step >= idx + 1 ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-fg-muted">
              Step {idx + 1} · {label}
            </p>
          </div>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error.message}</p>}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            onSubmit={handleNext}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="mt-6 space-y-5"
          >
            <Input label="Full name" icon={User} value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email address" icon={Mail} value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Mobile number" icon={Phone} value={phone} error={errors.phone} onChange={(e) => setPhone(e.target.value)} />
            <Button type="submit" size="lg" icon={ArrowRight} iconPosition="right" className="w-full">
              Continue
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="mt-6 space-y-5"
          >
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              error={errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm password"
              type="password"
              icon={Lock}
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" icon={ArrowLeft} onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" size="lg" className="flex-1" loading={loading}>
                Create Account
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="mt-8 text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:text-primary-700">
          Log in
        </Link>
      </p>
    </Card>
  );
};
export default Register;
