import FooterLogo from "../../../public/static/img/home/footer-logo.svg";
const Footer = () => {
  return (
    <div className="bg-[var(--black-color)] pt-16 pb-6 rounded-tl-[40px] rounded-tr-[40px] rounded-bl-none rounded-br-none">
      <div className="max-w-screen-2xl mx-auto px-10">
        <div className="grid grid-cols-4">
          <div className="">
              <img src={FooterLogo} alt="logo" />
              <p className="text-xs font-normal text-[var(--white-color)] mt-3">© 2025 <strong>TALENT BY DESIGN COLLECTIVE Inc.</strong>All rights reserved.</p>
              <h3 className="uppercase font-bold text-lg text-[var(--white-color)] mt-4">Follow us</h3>
          </div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Footer;
