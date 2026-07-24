/* eslint-disable react/prop-types */
import { Check, X } from "lucide-react";
import { acceptService, rejectService } from "../../services/employeeService";
import { toast } from "react-toastify";
import Card from "../ui/Card";
import Button from "../ui/Button";

const ServiceCard = ({ service, setIsChanged, isChanged, serviceList }) => {
  const handleAccept = async (id) => {
    try {
      const result = await acceptService(id);
      if (result.status == 200) {
        setIsChanged(!isChanged);
        toast.success(result.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleReject = async (id) => {
    try {
      const result = await rejectService(id);
      if (result.status == 200) {
        setIsChanged(!isChanged);
        toast.success(result.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="mb-5 flex items-center gap-5">
      <img
        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
        src={service.imageUrl}
        alt={service.name}
      />
      <div className="flex-1">
        <h3 className="font-semibold text-fg">{service.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{service.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-fg">${service.price}</p>
          {serviceList ? (
            <Button size="sm" icon={Check} onClick={() => handleAccept(service._id)}>
              Accept
            </Button>
          ) : (
            <Button size="sm" variant="danger" icon={X} onClick={() => handleReject(service._id)}>
              Decline
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
