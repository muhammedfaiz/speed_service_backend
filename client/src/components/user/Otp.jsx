import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, verifyOtp } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import { MailCheck, RotateCcw } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const OTP_LENGTH = 6;

const Otp = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const { user, error, loading } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const otp = digits.join("");

  function handleDigitChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ""));
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleSubmit() {
    if (!otp || otp.length < OTP_LENGTH) {
      setErrors({ otp: "Enter the full 6-digit code" });
      return;
    }
    if (user.otpSent) {
      setErrors({});
      dispatch(verifyOtp({ userId: user.id, otp }));
    }
  }

  async function handleResend() {
    await dispatch(resendOtp({ userId: user.id }));
    setDigits(Array(OTP_LENGTH).fill(""));
    setTimeLeft(60);
    setIsExpired(false);
    inputsRef.current[0]?.focus();
  }

  useEffect(() => {
    if (user?.isVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isExpired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card hoverable={false} padding="lg" className="!rounded-3xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 3 · Verification</p>
      <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <MailCheck size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Verify your email</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Enter the 6-digit code we sent to your email address.</p>

      {error && <p className="mt-4 text-sm text-red-500">{error.message}</p>}

      {!isExpired && (
        <p className="mt-6 text-center text-sm text-fg-muted">
          Code expires in <span className="font-semibold text-primary">{formatTime(timeLeft)}</span>
        </p>
      )}

      <div className="mt-4 flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`h-12 w-10 rounded-xl border text-center text-lg font-semibold text-fg shadow-soft outline-none transition-colors focus:ring-4 sm:h-14 sm:w-12 ${
              errors.otp
                ? "border-red-300 focus:ring-red-50"
                : "border-slate-200 focus:border-primary/50 focus:ring-primary-50"
            }`}
          />
        ))}
      </div>
      {errors.otp && <p className="mt-2 text-center text-xs text-red-500">{errors.otp}</p>}

      <div className="mt-8">
        {!isExpired ? (
          <Button size="lg" className="w-full" onClick={handleSubmit} loading={loading}>
            Verify
          </Button>
        ) : (
          <Button size="lg" variant="outline" icon={RotateCcw} className="w-full" onClick={handleResend}>
            Resend OTP
          </Button>
        )}
      </div>
    </Card>
  );
};
export default Otp;
