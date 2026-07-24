import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "../../components/user/AuthLayout";
import Register from "../../components/user/Register";
import Otp from "../../components/user/Otp";

const RegisterationPage = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  return (
    <AuthLayout
      heading="Join Speed Service"
      subheading="Create an account to book verified professionals for every home service."
    >
      <AnimatePresence mode="wait">
        {!showOtpInput ? (
          <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Register setToggle={setShowOtpInput} />
          </motion.div>
        ) : (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Otp />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};
export default RegisterationPage;
