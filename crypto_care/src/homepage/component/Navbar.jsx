import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { FaWallet } from "react-icons/fa";

import logo from "../../../images/LogoCC-black.png";

const NavbarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

const Navbar = ({ showList }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    // Akan melakukan md selama ukuran layar besar dari 768px
    <nav className="flex justify-between items-center p-4 mx-4">
      <div className="items-center flex-initial">
        <img src={logo} alt="logo" className="w-40 cursor-pointer" />
      </div>
      {showList && (
        <ul className="text-black md:flex flex-row hidden list-none items-center flex-initial">
          {["Home", "Tutorials", "Bridge", "Abouts"].map((item, index) => (
            <NavbarItem key={item + index} title={item} />
          ))}
        </ul>
      )}
      <div className=" text-white font-bold md:flex hidden flex-initial items-center bg-[#302CED] py-2 px-7 rounded-lg cursor-pointer hover:bg-[#2546bd]">
        <FaWallet className="mr-2" />
        <span>Connect</span>
      </div>
      <div className="flex relative md:hidden">
        {toggleMenu ? (
          <AiOutlineClose fontSize={28} className="text-black md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        ) : (
          <HiMenuAlt4 fontSize={28} className="text-black md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md white-glassmorphism text-black animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} className="cursor-pointer" />
            </li>
            {["Home", "Tutorials", "Bridge", "Abouts"].map((item, index) => (
              <NavbarItem key={item + index} title={item} classProps="text-black my-2 text-lg" />
            ))}
            <li className=" text-white font-bold bg-[#302CED] py-2 px-7 mt-5 rounded-lg cursor-pointer hover:bg-[#2546bd] justify-center items-center inline-flex w-full">
              <FaWallet className="mr-2" />
              <span>Connect</span>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
