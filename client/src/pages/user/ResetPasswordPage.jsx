import { useParams } from "react-router-dom";
import AuthLayout from "../../components/user/AuthLayout";
import ResetPasswordForm from "../../components/user/ResetPasswordForm";

const ResetPasswordPage = () => {
  const { id, token } = useParams();
  return (
    <AuthLayout>
      <ResetPasswordForm id={id} token={token} />
    </AuthLayout>
  );
};
export default ResetPasswordPage;
