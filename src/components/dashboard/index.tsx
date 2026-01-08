import ManagerOverview from "../../screens/managerOverview";
import Sidebar from "../sidebar";

const Dashboard = () => {
  return (
    <>
      {/* Dashboard Start */}
      <div className="main-wrapper flex gap-6 h-screen bg-[#EDF5FD] p-6">
        <div className=" relative max-w-80 w-full custom-h left-content bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] pt-8 pr-6 pb-6 pl-6 rounded-[12px]">
          <Sidebar />
        </div>

        <div className="right-content w-full">
          <ManagerOverview />
        </div>
      </div>
      {/* Dashboard End */}
    </>
  );
};

export default Dashboard;
