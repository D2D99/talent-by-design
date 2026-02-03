import { Dropdown, Ripple, initTWE, Offcanvas } from "tw-elements";
import { useEffect } from "react";
// import Sidebar from "../../components/sidebar";
// import OrgInvitation from "../../components/orgInvitation";

const SuperAdminOverview = () => {
  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });
  }, []);

  return (
    <>
      {/* Super Admin Overview Start */}
      <div>{/* <OrgInvitation /> */} hi</div>
      {/* Super Admin Overview End */}
    </>
  );
};

export default SuperAdminOverview;
