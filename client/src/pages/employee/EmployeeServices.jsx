import Navbar from "../../components/employee/Navbar";
import { PackageOpen } from "lucide-react";
import ServiceCard from "../../components/employee/ServiceCard";
import { useEffect, useState } from "react";
import { fetchServices } from "../../services/employeeService";
import Tabs from "../../components/ui/Tabs";
import EmptyState from "../../components/ui/EmptyState";

const EmployeeServices = () => {
  const [services, setServices] = useState([]);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    async function getServices() {
      try {
        const data = await fetchServices();
        setServices(data.services);
        setAcceptedServices(data.acceptedServices);
      } catch (error) {
        console.log(error);
      }
    }
    getServices();
  }, [isChanged]);

  const serviceList = activeTab === "available";
  const list = serviceList ? services : acceptedServices;

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-fg font-display">Services</h1>
        <p className="mt-1 text-fg-muted">Manage the services you can provide and the ones you&apos;ve accepted.</p>

        <Tabs
          className="mt-6 inline-flex"
          tabs={[
            { id: "available", label: "Service List" },
            { id: "accepted", label: "Accepted Services" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {list.length > 0 ? (
            list.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                setIsChanged={setIsChanged}
                isChanged={isChanged}
                serviceList={serviceList}
              />
            ))
          ) : (
            <EmptyState
              icon={PackageOpen}
              title={serviceList ? "No services available" : "No accepted services"}
              description={serviceList ? "Check back later for new service requests." : "Services you accept will show up here."}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeServices;
