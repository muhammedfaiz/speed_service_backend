import { useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import EditCategoryForm from "../../components/admin/EditCategoryForm";
import Card from "../../components/ui/Card";

const EditCategoryPage = () => {
  const { id } = useParams();
  return (
    <AdminLayout title="Edit Category" subtitle="Update category details.">
      <Card hoverable={false} padding="lg">
        <EditCategoryForm id={id} />
      </Card>
    </AdminLayout>
  );
};
export default EditCategoryPage;
