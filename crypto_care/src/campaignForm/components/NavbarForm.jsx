import { FaWallet } from "react-icons/fa";

import logo from "../../../images/LogoCC-black.png";

const NavbarForm = () => {
  return (
    // Akan melakukan md selama ukuran layar besar dari 768px
    <nav className="flex justify-between items-center p-4 mx-4">
      <div className="items-center flex-initial">
        <img src={logo} alt="logo" className="w-40 cursor-pointer" />
      </div>
      <div className=" text-white font-bold md:flex hidden flex-initial items-center bg-[#302CED] py-2 px-7 rounded-lg cursor-pointer hover:bg-[#2546bd]">
        <FaWallet className="mr-2" />
        <span>Connect</span>
      </div>
    </nav>
  );
};

export default NavbarForm;
