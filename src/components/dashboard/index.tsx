import { Outlet } from "react-router-dom";
import { useState } from "react";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import Sidebar from "../sidebar";
import TopBar from "../topBar";

const Dashboard = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={`main-wrapper flex gap-6 min-h-screen relative bg-[#EDF5FD] md:p-6 p-3 ${
        isActive ? "active" : ""
      }`}
    >
      {/* Sidebar */}
      <div className="md:block hidden fixed h-[-webkit-fill-available] mb-6 xl:max-w-80 max-w-64 w-full bg-white border border-[#448CD2] border-opacity-20 shadow rounded-[12px] pt-8 pr-6 pb-6 pl-6">
        <Sidebar />

        <div
          className="restore-sidebar absolute top-[80px] right-[-12px] cursor-pointer"
          onClick={() => setIsActive(!isActive)}
        >
          <img src={IconamoonArrow} alt="arrow" className="rotate-180" />
        </div>
      </div>

      {/* Right Content */}
      <div className="xl:ml-[343px] md:ml-[278px] w-full">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
