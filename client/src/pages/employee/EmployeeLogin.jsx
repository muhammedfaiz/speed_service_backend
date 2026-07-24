import AuthLayout from "../../components/user/AuthLayout";
import EmployeeLoginForm from "../../components/employee/EmployeeLoginForm";

const EmployeeLogin = () => {
  return (
    <AuthLayout
      heading="Grow your business with us"
      subheading="Manage your bookings, track earnings, and connect with customers as a verified professional."
    >
      <EmployeeLoginForm />
    </AuthLayout>
  );
};
export default EmployeeLogin;
