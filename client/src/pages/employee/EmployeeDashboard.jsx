import Navbar from "../../components/employee/Navbar";
import Banner from "../../components/employee/Banner";
import StatisticsOverview from "../../components/employee/StatisticsOverview";
import UpcomingTasks from "../../components/employee/UpcomingTasks";
import Notifications from "../../components/employee/Notifications";
import RecentActivities from "../../components/employee/RecentActivities";
import Footer from "../../components/employee/Footer";

const EmployeeDashboard = () => {
  return (
    <>
      <Navbar />
      <Banner />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <StatisticsOverview />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingTasks />
          <Notifications />
        </div>
        <RecentActivities />
      </div>

      <Footer />
    </>
  );
};

export default EmployeeDashboard;
