import ManagerOverview from "../../screens/managerOverview";
import Sidebar from "../sidebar";

const Dashboard = () => {
  return (
    <>
      {/* Dashboard Start */}
      <div className="main-wrapper flex gap-4">
        <div className="left-content">
          <Sidebar />
        </div>

        <div className="right-content">
          <ManagerOverview />
        </div>
      </div>
      {/* Dashboard End */}
    </>
  );
};

export default Dashboard;
