import Logo from "../../../public/static/img/home/logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";

const AfterRegister = () => {
  return (
    <>
      <div className=" flex min-h-screen bg-[var(--light-primary-color)]">
        <div
          className=" lg:block hidden w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('/public/static/img/home/login-img.png')",
          }}
        >
          <div className="flex justify-center items-center h-full bg-black bg-opacity-50"></div>
        </div>

        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="" />
          </div>
          <div className="w-full mx-auto max-w-96 rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            {/* Form */}

            <img src={ResendMail} className="mx-auto" alt="email-icon" />
            <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)] mb-1">
              Verify Your Email
            </h2>
            <p className="text-sm font-normal sm:mb-6 mb-3 text-center">
              We've sent an email to manik99@yopmail.com. Please click the link
              inside to verify your email and activate your new account.
            </p>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm font-bold text-[#448bd28a] ">
                Resend Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AfterRegister;
