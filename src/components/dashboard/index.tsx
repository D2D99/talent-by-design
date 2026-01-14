import { useState } from "react";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
// import ManagerOverview from "../../screens/managerOverview";
import Sidebar from "../sidebar";
import LeaderOverview from "../../screens/leaderOverview";

const Dashboard = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMainWrapper = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <>
      {/* Dashboard Start */}
      <div
        className={`main-wrapper flex gap-6 h-full bg-[#EDF5FD] md:p-6 p-3 ${
          isActive ? "active" : ""
        }`}
      >
        {/* Sidebar Section */}
        <div className="md:block hidden  fixed h-[-webkit-fill-available] mb-6 xl:max-w-80 max-w-64 w-full left-content bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] pt-8 pr-6 pb-6 pl-6 rounded-[12px]">
          <Sidebar />

          {/* Restore Sidebar Button (Arrow) */}
          <div
            className="restore-sidebar absolute top-[80px] right-[-12px] cursor-pointer"
            onClick={toggleMainWrapper}
          >
            <img src={IconamoonArrow} alt="arrow" />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="xl:ml-[343px] md:ml-[278px] ml-[0px]  right-content w-full">
          {/* <ManagerOverview /> */}
          <LeaderOverview />
        </div>
      </div>
      {/* Dashboard End */}
    </>
  );
};

export default Dashboard;
