// import { useState } from "react";
// import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
// // import ManagerOverview from "../../screens/managerOverview";
// import Sidebar from "../sidebar";
// // import CrudQuestion from "../../screens/crudQuestion";
// import Orginvitation from "../../screens/orgInvitation";
// // import LeaderOverview from "../../screens/leaderOverview";

// const Dashboard = () => {
//   const [isActive, setIsActive] = useState(false);

//   const toggleMainWrapper = () => {
//     setIsActive((prevState) => !prevState);
//   };

//   return (
//     <>
//       {/* Dashboard Start */}
//       <div
//         className={`main-wrapper flex gap-6 min-h-screen relative bg-[#EDF5FD] md:p-6 p-3 ${
//           isActive ? "active" : ""
//         }`}
//       >
//         {/* Sidebar Section */}
//         <div className="md:block hidden fixed h-[-webkit-fill-available] mb-6 xl:max-w-80 max-w-64 w-full left-content bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] pt-8 pr-6 pb-6 pl-6 rounded-[12px]">
//           <Sidebar />

//           {/* Restore Sidebar Button (Arrow) */}
//           <div
//             className="restore-sidebar absolute top-[80px] right-[-12px] cursor-pointer"
//             onClick={toggleMainWrapper}
//           >
//             <img src={IconamoonArrow} alt="arrow" />
//           </div>
//         </div>

//         {/* Main Content Section */}
//         <div className="xl:ml-[343px] md:ml-[278px] ml-[0px] right-content w-full h-full">
//           {/* <ManagerOverview /> */}
//           {/* <LeaderOverview /> */}
//           {/* <CrudQuestion /> */}
//           <Orginvitation />
//         </div>
//       </div>
//       {/* Dashboard End */}
//     </>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import Sidebar from "../sidebar";

// Import your screens
import ManagerOverview from "../../screens/managerOverview";
import LeaderOverview from "../../screens/leaderOverview";
import SuperAdminOverview from "../../screens/superAdminOverview";
import AdminOverview from "../../screens/adminOverview";
import PageNotFound from "../../screens/pageNotFound";

const Dashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Read user from localStorage on component mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  const toggleMainWrapper = () => {
    setIsActive((prevState) => !prevState);
  };

  // ✅ Updated logic to handle SuperAdmin and Admin separately
  const renderRoleContent = () => {
    if (!userRole) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      );
    }

    const role = userRole.toLowerCase();

    switch (role) {
      case "superadmin":
        return <SuperAdminOverview />;

      case "admin":
        return <AdminOverview />;

      case "manager":
        return <ManagerOverview />;

      case "leader":
        return <LeaderOverview />;

      default:
        // Default fallback if role is unknown or for an "employee" role
        return <PageNotFound />;
    }
  };

  return (
    <div
      className={`main-wrapper flex gap-6 min-h-screen relative bg-[#EDF5FD] md:p-6 p-3 ${
        isActive ? "active" : ""
      }`}
    >
      {/* Sidebar Section */}
      <div className="md:block hidden fixed h-[-webkit-fill-available] mb-6 xl:max-w-80 max-w-64 w-full left-content bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] pt-8 pr-6 pb-6 pl-6 rounded-[12px]">
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
      <div
        className="
      xl:ml-[343px] md:ml-[278px] ml-[0px] right-content w-full h-full"
      >
        {renderRoleContent()}
      </div>
    </div>
  );
};

export default Dashboard;
