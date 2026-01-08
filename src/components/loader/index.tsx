import LoaderGif from "../../../public/loader.gif";

const Loader = () => {
  return (
    <>
      {/* Loading Screen Start */}
      <div className="w-full h-screen bg-primary-100 grid place-items-center">
        <img src={LoaderGif} alt="Loader" />
      </div>
      {/* Loading Screen End */}
    </>
  );
};

export default Loader;
