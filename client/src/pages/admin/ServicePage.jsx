import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ServiceList from "../../components/admin/ServiceList";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const ServicePage = () => {
  const navigate = useNavigate();
  return (
    <AdminLayout
      title="Services"
      subtitle="Manage your services here."
      actions={
        <Button icon={Plus} onClick={() => navigate("/admin/add-service")}>
          Add Service
        </Button>
      }
    >
      <Card hoverable={false}>
        <ServiceList />
      </Card>
    </AdminLayout>
  );
};
export default ServicePage;
