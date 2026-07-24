import { useEffect, useState } from "react";
import { getCategoriesService, getService, updateService } from "../../services/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";

const selectClass = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-fg shadow-soft outline-none transition-colors focus:ring-4 ${
    hasError ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-primary/50 focus:ring-primary-50"
  }`;

// eslint-disable-next-line react/prop-types
const ServiceEdit = ({ id }) => {
  const [service, setService] = useState({});
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEditService() {
      try {
        const result = await getService(id);
        const response = await getCategoriesService();
        setService(result.service);
        setCategories(response.categories);
      } catch (error) {
        console.log(error);
      }
    }
    fetchEditService();
  }, [id]);
  useEffect(() => {
    setData(service);
  }, [service]);

  function validate() {
    let errors = {};
    if (!data.name) errors.name = "Service Name is required";
    if (!data.price) errors.price = "Price is required";
    if (!data.category) errors.category = "Category is required";
    if (!data.description) errors.description = "Description is required";
    if (!/^[A-Za-z\s]+$/.test(data.name)) {
      errors.name = "Name should be alphabetical and can include spaces";
    }
    if (!/^\d*\.?\d+$/.test(data.price) || parseFloat(data.price) <= 0) {
      errors.price = "Price should be a positive number";
    }
    return errors;
  }
  function handleImageChange(e) {
    const file = e.target.files[0];
    setData({ ...data, image: file });
    setPreview(URL.createObjectURL(file));
  }
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
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
      const result = await updateService(id, formData);
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
        <Input label="Service name" name="name" value={data.name || ""} onChange={handleChange} error={errors.name} />
        <Input label="Price" name="price" value={data.price || ""} onChange={handleChange} error={errors.price} />
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          value={data.description || ""}
          onChange={handleChange}
          rows={3}
          className={selectClass(errors.description)}
        />
        {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div>
        <select name="category" value={data.category || ""} onChange={handleChange} className={selectClass(errors.category)}>
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
          className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-8 text-center transition-colors hover:bg-slate-50"
        >
          <img src={preview || service.imageUrl} alt="Preview" className="h-32 w-32 rounded-xl object-cover" />
          <span className="text-sm text-fg-muted">Click to change image</span>
          <input id="service-image" type="file" accept="image/png, image/jpg, image/jpeg" onChange={handleImageChange} className="sr-only" />
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Save Changes
      </Button>
    </form>
  );
};
export default ServiceEdit;
