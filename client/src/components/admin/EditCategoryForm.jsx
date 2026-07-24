import { useEffect, useState } from "react";
import { getCategoryDetails, updateCategory } from "../../services/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

// eslint-disable-next-line react/prop-types
const EditCategoryForm = ({ id }) => {
  const [category, setCategory] = useState({ name: "", image: null });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryDetails(id);
        setCategory({ name: data.category.name || "" });
        setPreview(data.category.image);
      } catch (error) {
        toast.error("Failed to fetch category details");
      }
    };
    fetchCategory();
  }, [id]);

  const validateForm = () => {
    let formErrors = {};
    if (!category.name) formErrors.name = "Category name is required";
    return formErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory({ ...category, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", category.name);
      if (category.image) {
        formData.append("image", category.image);
      }
      const result = await updateCategory(id, formData);
      if (result.status == 200) {
        toast.success("Category updated successfully!");
        navigate("/admin/categories");
      }
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
      <Input
        label="Category name"
        value={category.name}
        error={errors.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
      />

      <div>
        <label
          htmlFor="category-image"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-8 text-center transition-colors hover:bg-slate-50"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="h-32 w-32 rounded-xl object-cover" />
          ) : (
            <>
              <ImagePlus size={28} className="text-fg-subtle" />
              <span className="text-sm text-fg-muted">PNG, JPG, or JPEG</span>
            </>
          )}
          <input id="category-image" type="file" accept="image/png, image/jpg, image/jpeg" onChange={handleImageChange} className="sr-only" />
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Save Changes
      </Button>
    </form>
  );
};

export default EditCategoryForm;
