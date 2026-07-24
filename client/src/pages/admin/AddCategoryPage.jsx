import AdminLayout from "../../components/admin/AdminLayout";
import CategoryForm from "../../components/admin/CategoryForm";
import Card from "../../components/ui/Card";

const AddCategoryPage = () => {
  return (
    <AdminLayout title="Add Category" subtitle="Create a new category.">
      <Card hoverable={false} padding="lg">
        <CategoryForm />
      </Card>
    </AdminLayout>
  );
};
export default AddCategoryPage;
