import React from "react";
import decentralized from "../../../images/decentralized.png";
import fastest from "../../../images/fastest.png";
import secured from "../../../images/secured.png";
import smartcontract from "../../../images/smartcontract.png";
import transparent from "../../../images/transparent.png";

const CardService = ({ image, title, description }) => {
  return (
    <div className="flex md:flex-col items-center md:justify-center justify-between white-glassmorphism rounded-lg shadow flex-row md:w-40 w-full py-2 md:px-2 px-4 md:aspect-square md:ml-3 my-2">
      <img className="md:h-1/3 w-1/4 md:w-1/3 mx-2" src={image} alt="" />
      <div className="flex flex-col leading-normal items-center py-1">
        <p className="flex font-bold items-center">{title}</p>
        <p className="text-xs font-thin text-[#7B7D8C] text-center">{description}</p>
      </div>
    </div>
  );
};

const Services = () => {
  return (
    <div className="flex items-center justify-center py-5 blue-glassmorphism">
      <div className="md:flex w-5/6 items-center justify-center md:justify-around">
        <h1 className="text-lg md:text-3xl mb-5">
          <span className="text-[#302CED] font-extrabold">CryptoCare</span> Service
        </h1>
        <div className="md:flex md:flex-col">
          <div className="md:flex ">
            <CardService image={transparent} title="Transparency" description="Every transaction is recorded and can be known by anyone." />
            <CardService image={decentralized} title="Decentralized" description="No single entity holds the money raised" />
            <CardService image={fastest} title="Fastest" description="Withdrawal of fundraising results is very fast" />
          </div>
          <div className="md:flex justify-center ">
            <CardService image={secured} title="Secured" description="Cannot be manipulated because it uses the blockchain" />
            <CardService image={smartcontract} title="Smartcontract" description="Ensure that every fund transaction is carried out automatically" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
