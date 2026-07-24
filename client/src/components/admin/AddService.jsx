import { useEffect, useState } from "react";
import { addService, getCategoriesService } from "../../services/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const selectClass = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-fg shadow-soft outline-none transition-colors focus:ring-4 ${
    hasError ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-primary/50 focus:ring-primary-50"
  }`;

const AddService = () => {
  const [categories, setCategories] = useState();
  const [data, setData] = useState({});
  const [preview, setPreview] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesService();
        setCategories(response.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  function handleImageChange(e) {
    const file = e.target.files[0];
    setData({ ...data, image: file });
    setPreview(URL.createObjectURL(file));
  }

  function validate() {
    let errors = {};
    if (!data.name) errors.name = "Service Name is required";
    if (!data.price) errors.price = "Price is required";
    if (!data.category) errors.category = "Category is required";
    if (!data.description) errors.description = "Description is required";
    if (!data.image) errors.image = "Image is required";
    if (!/^[A-Za-z\s]+$/.test(data.name)) {
      errors.name = "Name should be alphabetical and can include spaces";
    }
    if (!/^\d*\.?\d+$/.test(data.price) || parseFloat(data.price) <= 0) {
      errors.price = "Price should be a positive number";
    }
    return errors;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      let validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("image", data.image);
      let result = await addService(formData);
      if (result.status == 200) {
        toast.success(result.data.message);
        navigate("/admin/services");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="Service name" name="name" onChange={handleChange} error={errors.name} />
        <Input label="Price" name="price" onChange={handleChange} error={errors.price} />
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          rows={3}
          className={selectClass(errors.description)}
        />
        {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div>
        <select name="category" onChange={handleChange} className={selectClass(errors.category)} defaultValue="">
          <option value="">Select a category</option>
          {categories &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
      </div>

      <div>
        <label
          htmlFor="service-image"
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
          <input id="service-image" type="file" accept="image/png, image/jpg, image/jpeg" onChange={handleImageChange} className="sr-only" />
        </label>
        {errors.image && <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Add Service
      </Button>
    </form>
  );
};
export default AddService;
