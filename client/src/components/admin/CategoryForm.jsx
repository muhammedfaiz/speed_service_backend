import { useState } from "react";
import { addCategoryService } from "../../services/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const CategoryForm = () => {
  const [form, setForm] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    let errors = {};
    if (!form.name) {
      errors.name = "Please enter category name";
    }
    if (!form.image) {
      errors.image = "Please select an image";
    } else if (!["image/png", "image/jpg", "image/jpeg"].includes(form.image.type)) {
      errors.image = "Invalid file type. Only PNG, JPG, JPEG are allowed";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image);
      await addCategoryService(formData);
      toast.success("Added Category successfully");
      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
      <Input label="Category name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <div>
        <label
          htmlFor="category-image"
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors hover:bg-slate-50 ${
            errors.image ? "border-red-300" : "border-slate-200"
          }`}
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
        {errors.image && <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Add Category
      </Button>
    </form>
  );
};
export default CategoryForm;
