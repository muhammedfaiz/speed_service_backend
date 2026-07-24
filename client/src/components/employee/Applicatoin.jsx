import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus, UploadCloud, FileCheck2 } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const Application = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    experience: "",
    proof: null,
  });
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesignation = async () => {
      const response = await axios.get(
        "https://api.speedservice.store/api/employee/categories"
      );
      setDesignations(response.data);
    };
    fetchDesignation();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData({
      ...data,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email) newErrors.email = "Email is required";
    if (!data.phone) newErrors.phone = "Phone number is required";
    if (!data.designation) newErrors.designation = "Designation is required";
    if (!data.experience) newErrors.experience = "Experience is required";
    if (!data.proof) newErrors.proof = "Proof document is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setLoading(true);
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      const response = await axios.post(
        "https://api.speedservice.store/api/employee/apply",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status == 200) {
        toast.success("Application Submitted!!");
        navigate("/employee/success");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hoverable={false} padding="lg" className="mx-auto max-w-2xl !rounded-3xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <UserPlus size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg font-display">Employee Application</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Apply to become a verified Speed Service professional.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Full name" name="name" onChange={handleChange} error={errors.name} />
          <Input label="Email address" name="email" type="email" onChange={handleChange} error={errors.email} />
          <Input label="Phone" name="phone" onChange={handleChange} error={errors.phone} />
          <Input label="Experience (years)" name="experience" onChange={handleChange} error={errors.experience} />
        </div>

        <div>
          <select
            name="designation"
            onChange={handleChange}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-fg shadow-soft outline-none transition-colors focus:ring-4 ${
              errors.designation
                ? "border-red-300 focus:ring-red-50"
                : "border-slate-200 focus:border-primary/50 focus:ring-primary-50"
            }`}
          >
            <option value="">Select a designation</option>
            {designations?.categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.designation && <p className="mt-1.5 text-xs text-red-500">{errors.designation}</p>}
        </div>

        <div>
          <label
            htmlFor="file-upload"
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors hover:bg-slate-50 ${
              errors.proof ? "border-red-300" : "border-slate-200"
            }`}
          >
            {data.proof ? (
              <>
                <FileCheck2 size={28} className="text-accent-600" />
                <span className="text-sm font-medium text-fg">{data.proof.name}</span>
              </>
            ) : (
              <>
                <UploadCloud size={28} className="text-fg-subtle" />
                <span className="text-sm text-fg-muted">Upload your proof document</span>
              </>
            )}
            <input id="file-upload" name="proof" onChange={handleChange} type="file" className="sr-only" />
          </label>
          {errors.proof && <p className="mt-1.5 text-xs text-red-500">{errors.proof}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link to="/employee/login" className="text-sm font-medium text-primary hover:text-primary-700">
            Already providing service?
          </Link>
          <Button type="submit" loading={loading}>
            Apply
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Application;
