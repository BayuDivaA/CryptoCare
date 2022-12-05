import React from "react";
import logo from "../../../images/LogoCC-white.png";

const Footer = () => {
  return (
    <div className="flex bg-[#302CED] justify-center">
      <div className="flex items-center py-2 justify-center flex-col md:flex-row md:justify-between w-5/6">
        <img src={logo} alt="logo" className="w-32 md:w-36 cursor-pointer py-2" />
        <p className="text-white text-xs md:text-base">
          &copy; 2022 <b>Crypto Care</b>. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
