import { useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import ServiceEdit from "../../components/admin/ServiceEdit";
import Card from "../../components/ui/Card";

const EditService = () => {
  const { id } = useParams();
  return (
    <AdminLayout title="Edit Service" subtitle="Update service details.">
      <Card hoverable={false} padding="lg">
        <ServiceEdit id={id} />
      </Card>
    </AdminLayout>
  );
};
export default EditService;
