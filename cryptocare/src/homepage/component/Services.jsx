import React from "react";
import decentralized from "../../../images/decentralized.png";
import fastest from "../../../images/fastest.png";
import secured from "../../../images/secured.png";
import smartcontract from "../../../images/smartcontract.png";
import transparent from "../../../images/transparent.png";

const CardService = ({ image, title, description }) => {
  return (
    <div className="bg-white p-2 flex flex-col justify-center items-center w-40 aspect-square rounded-md ml-3 my-3">
      <img src={image} alt="transparent" className="h-1/3 mb-2" />
      <p className="flex font-bold items-center py-1">{title}</p>
      <p className="text-xs font-thin text-[#7B7D8C] text-center">{description}</p>
    </div>
  );
};

const Services = () => {
  return (
    <div className="flex items-center justify-center py-5 blue-glassmorphism">
      <div className="md:flex md:w-5/6 items-center justify-start md:justify-around">
        <h1 className="text-lg md:text-3xl">
          <span className="text-[#302CED] font-extrabold mb-4">CryptoCare</span> Service
        </h1>
        <div className="md:flex md:flex-col grid-flow-col">
          <div className="md:flex ">
            <CardService image={transparent} title="Transparency" description="Funds are stored and distributed without any third party" />
            <CardService image={decentralized} title="Decentralized" description="Funds are stored and distributed without any third party" />
            <CardService image={fastest} title="Fastest" description="Funds are stored and distributed without any third party" />
          </div>
          <div className="md:flex justify-center">
            <CardService image={secured} title="Secured" description="Funds are stored and distributed without any third party" />
            <CardService image={smartcontract} title="Smartcontract" description="Funds are stored and distributed without any third party" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
