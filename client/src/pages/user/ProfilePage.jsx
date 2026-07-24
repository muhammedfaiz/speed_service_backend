import { useEffect, useRef, useState } from "react";
import { Pencil, X, Camera, User as UserIcon, ClipboardList, CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { useDispatch, useSelector } from "react-redux";
import { changeProfileImage, getProfile, updateProfileDetails } from "../../features/userSlice";
import { toast } from "react-toastify";
import userService from "../../services/userService";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((store) => store.user);
  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({});
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch, isEditing]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await userService.getStatsOfUser();
      setStats(data.stats);
    };
    fetchStats();
  }, []);

  const handleEditToggle = () => {
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
      dispatch(updateProfileDetails(data));
      toast.success("Profile updated successfully!");
      setErrors({});
      setIsEditing(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type ${file.type}`);
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    dispatch(changeProfileImage(formData));
  };

  const STATS = [
    { label: "Services Booked", value: stats.booked, icon: ClipboardList, color: "text-primary bg-primary-50" },
    { label: "Services Completed", value: stats.completed, icon: CheckCircle2, color: "text-accent-600 bg-accent-50" },
    { label: "Pending Service", value: stats.pending, icon: Clock3, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card hoverable={false} padding="lg" className="!rounded-3xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                {user.url ? (
                  <Avatar src={user.url} size="xl" ring />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-fg-subtle">
                    <UserIcon size={40} />
                  </span>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-soft hover:bg-primary-700"
                >
                  <Camera size={14} />
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-fg font-display">{user?.name}</h2>
                <p className="text-sm text-fg-muted">{user?.email}</p>
                <p className="text-sm text-fg-muted">{user?.phone}</p>
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
                <Input label="Name" name="name" value={data.name} onChange={handleInputChange} error={errors.name} />
                <Input label="Email" name="email" value={data.email} onChange={handleInputChange} error={errors.email} />
                <Input label="Phone" name="phone" value={data.phone} onChange={handleInputChange} error={errors.phone} />
              </div>
              <Button type="submit" size="lg">
                Save Changes
              </Button>
            </form>
          )}

          <div className="mt-10 border-t border-slate-100 pt-8">
            <h3 className="text-lg font-semibold text-fg font-display">Your Stats</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STATS.map((stat) => (
                <Card key={stat.label} padding="md" className="text-center">
                  <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                    <stat.icon size={22} />
                  </span>
                  <h4 className="mt-3 text-2xl font-bold text-fg font-display">{stat.value || 0}</h4>
                  <p className="text-sm text-fg-muted">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
