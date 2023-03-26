import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import addPerson from "../../images/addPerson.svg";
import verified from "../../images/verified.svg";
import campaign from "../../images/campaign.svg";
import profile from "../../images/profile.svg";

import logo from "../../images/LogoOnly.png";
import { useEthers } from "@usedapp/core";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] hover:sidebar-glassmorphism ${isActive && isActive === name && "sidebar-glassmorphism"} flex justify-center items-center ${!disabled && "cursor-pointer"} ${styles}`} onClick={handleClick}>
    {!isActive ? <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2 text-white" /> : <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`} />}
  </div>
);

const Sidebar = ({ verif, admin }) => {
  const navigate = useNavigate();
  const { account } = useEthers();
  const [isActive, setIsActive] = useState("verification");

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] sidebar-glassmorphism" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center admin-glassmorphism rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          <Icon
            name="verification"
            imgUrl={verified}
            link="/"
            isActive={isActive}
            handleClick={() => {
              setIsActive("verification");
              verif();
            }}
          />
          <Icon
            name="addAdmin"
            imgUrl={addPerson}
            link="/"
            isActive={isActive}
            handleClick={() => {
              setIsActive("addAdmin");
              admin();
            }}
          />
          <Icon
            name="campaign"
            imgUrl={campaign}
            link="/"
            isActive={isActive}
            handleClick={() => {
              setIsActive("campaign");
            }}
          />
        </div>
        {account && (
          <Link to={`/profile/${account}`}>
            <Icon className="sidebar-glassmorphism shadow-secondary" imgUrl={profile} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
