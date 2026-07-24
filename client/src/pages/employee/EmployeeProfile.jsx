import { useState, useEffect } from "react";
import { Pencil, X, Mail, Phone, User as UserIcon, Briefcase, CalendarClock } from "lucide-react";
import Navbar from "../../components/employee/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateEmployeeProfile } from "../../features/employeeSlice";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { employee } = useSelector((store) => store.employee);
  const [data, setData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleEditToggle = () => {
    setData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
    });
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  function validation() {
    let errors = {};
    if (!data.name) {
      errors.name = "Name is required";
    }
    if (data.name && !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(data.name)) {
      errors.name = "Invalid name format";
    }
    if (!data.email) {
      errors.email = "Email is required";
    }
    if (data.email && !/^\S+@\S+\.\S+$/i.test(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.phone) {
      errors.phone = "Phone number is required";
    }
    if (data.phone && !/^\d{10}$/.test(Number(data.phone))) {
      errors.phone = "Invalid phone number format";
    }
    return errors;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      dispatch(updateEmployeeProfile(data));
      toast.success("Profile updated successfully!");
      setErrors({});
      setIsEditing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card hoverable={false} padding="lg" className="!rounded-3xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar name={employee?.name} size="xl" ring />
              <div>
                <h1 className="text-2xl font-bold text-fg font-display">{employee?.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
                  <Mail size={14} /> {employee?.email}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
                  <Phone size={14} /> {employee?.phone}
                </p>
                <Badge variant={employee?.status === "active" ? "accent" : "danger"} className="mt-2">
                  {employee?.status}
                </Badge>
              </div>
            </div>
            {isEditing ? (
              <Button variant="danger" icon={X} onClick={handleEditToggle}>
                Cancel
              </Button>
            ) : (
              <Button icon={Pencil} onClick={handleEditToggle}>
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing && (
            <form onSubmit={handleFormSubmit} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Input label="Name" name="name" icon={UserIcon} value={data.name} onChange={handleInputChange} error={errors.name} />
                <Input label="Email" name="email" icon={Mail} value={data.email} onChange={handleInputChange} error={errors.email} />
                <Input label="Phone" name="phone" icon={Phone} value={data.phone} onChange={handleInputChange} error={errors.phone} />
              </div>
              <Button type="submit" size="lg">
                Save Changes
              </Button>
            </form>
          )}

          <div className="mt-10 border-t border-slate-100 pt-8">
            <h3 className="text-lg font-semibold text-fg font-display">Additional Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card padding="md" className="text-center">
                <Briefcase className="mx-auto text-primary" size={28} />
                <h4 className="mt-2 text-xl font-bold text-fg">{employee?.designation}</h4>
                <p className="text-sm text-fg-muted">Designation</p>
              </Card>
              <Card padding="md" className="text-center">
                <CalendarClock className="mx-auto text-primary" size={28} />
                <h4 className="mt-2 text-xl font-bold text-fg">{employee?.experience} years</h4>
                <p className="text-sm text-fg-muted">Experience</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmployeeProfile;
