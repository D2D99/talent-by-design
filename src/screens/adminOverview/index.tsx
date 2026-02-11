import { Icon } from "@iconify/react";

const AdminOverview = () => {
  return (
    <>
      {/* Admin Overview Start */}
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-178px)]">
        <div className="grid">
          <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
            <div>
              <h2 className="md:text-2xl text-xl font-bold">Overview</h2>
              {/* <p className="text-sm text-gray-500 md:mt-1">isSuperAdmin</p> */}
            </div>
            <button
              type="button"
              data-twe-toggle="modal"
              data-twe-target="#inviteModal"
              className="relative overflow-hidden z-0 text-[var(--white-color)] ps-4 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              <Icon icon="uil:export" width="16" height="16" />
              Export report{" "}
            </button>
          </div>

          <p className="text-base text-gray-500 md:mt-1 text-center">
            No Data Yet!!!
          </p>
        </div>
      </div>
      {/* Admin Overview End */}
    </>
  );
};

export default AdminOverview;
