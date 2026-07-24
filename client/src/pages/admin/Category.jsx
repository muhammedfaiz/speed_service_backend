import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import CategoryList from "../../components/admin/CategoryList";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const Category = () => {
  const navigate = useNavigate();
  return (
    <AdminLayout
      title="Categories"
      subtitle="Manage your categories here."
      actions={
        <Button icon={Plus} onClick={() => navigate("/admin/add-category")}>
          Add Category
        </Button>
      }
    >
      <Card hoverable={false}>
        <CategoryList />
      </Card>
    </AdminLayout>
  );
};
export default Category;
