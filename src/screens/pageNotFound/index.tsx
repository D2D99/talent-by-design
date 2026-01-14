import { Icon } from "@iconify/react";
// import NotFound from "../../../public/static/img/404.svg";
import NotFound from "../../../public/static/img/404.gif";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "../../components/spinnerLoader";
import { useEffect, useState } from "react";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  // ✅ PAGE LOADER (ADDED)
  const [pageLoading, setPageLoading] = useState(true);

  // ✅ PAGE LOADER EFFECT (ADDED)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  // ✅ LOADER RENDERS FIRST
  if (pageLoading) {
    return <SpinnerLoader />;
  }
  return (
    <>
      {/* Page Not Found UI Start */}
      <div
        className="h-screen w-full !bg-cover !bg-center !bg-no-repeat flex justify-center flex-col items-center text-center px-4"
        id="not-found-bg"
      >
        <img src={NotFound} alt="404 Image" />
        <h1 className="sub-heading !max-w-full !font-semibold !bg-gradient-to-b !from-neutral-800 !to-primary-600 !bg-clip-text !text-transparent">
          We're not able to find what you were looking for.
        </h1>
        <button
          type="button"
          className="w-fit sm:mt-10 mt-5 mx-auto group text-white ps-5 p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] group"
          onClick={handleClick}
        >
          Back To Home
          <Icon
            icon="mynaui:arrow-right-circle-solid"
            width="25"
            className="transition-transform duration-300 -rotate-45 group-hover:rotate-0"
          />
        </button>
      </div>
      {/* Page Not Found UI End */}
    </>
  );
};

export default PageNotFound;
