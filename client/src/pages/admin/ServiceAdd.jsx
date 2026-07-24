import AdminLayout from "../../components/admin/AdminLayout";
import AddService from "../../components/admin/AddService";
import Card from "../../components/ui/Card";

const ServiceAdd = () => {
  return (
    <AdminLayout title="Add Service" subtitle="Create a new service.">
      <Card hoverable={false} padding="lg">
        <AddService />
      </Card>
    </AdminLayout>
  );
};
export default ServiceAdd;
