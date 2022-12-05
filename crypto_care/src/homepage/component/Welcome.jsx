import { TbCurrencyEthereum } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi";
import { BiDonateHeart } from "react-icons/bi";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {/* SLOGAN CRYPTOCARE ---- */}
        <div className="flex flex-col md:pt-12 pt-5 w-5/6">
          <div className="flex flex-col">
            <h1 className="md:text-5xl text-2xl text-center font-semibold md:leading-snug">
              <span className="text-[#302CED]">Donate</span> your <span className="text-[#302CED] text-gradient">crypto assets</span> <br /> for those in need.
            </h1>
            <p className="md:text-lg text-sm text-center my-3 tracking-wide">Be a part of the breakthrough and make someone’s dream come true.</p>
          </div>
        </div>
        {/* HOW TO n DONATE BUTTON ---- */}
        <div className="flex md:flex-row flex-col justify-center items-center md:mt-12 w-full">
          <button className="md:w-1/5 w-2/5 bg-transparent hover:bg-[#2546bd] text-[#302CED] font-semibold hover:text-white md:py-3 py-1 md:mx-3 m-2 border border-blue-500 hover:border-transparent rounded-lg">How To</button>

          <button className="md:w-1/5 w-2/5 bg-[#2546bd] hover:bg-[#302CED] text-white font-semibold md:py-3 py-1 border border-[#2546bd] rounded-lg">New Campaigns</button>
        </div>
        {/* ACCUMULATE DONORS, CAMAPIGNS, ETHERS ---- */}
        <div className="flex md:flex-row flex-col md:justify-around mt-10 mb-12 md:px-24 md:py-7 px-10 white-glassmorphism md:w-5/6">
          <div className="flex flex-row items-center py-2">
            <HiOutlineUsers className="md:text-6xl text-3xl mr-2" />
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl font-bold text-[#302CED]">78</span>
              <p className="md:text-xl text-sm">Donors</p>
            </div>
          </div>
          <div className="flex flex-row items-center py-2">
            <BiDonateHeart className="md:text-6xl text-3xl mr-2" />
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl font-bold text-[#302CED]">78</span>
              <span className="md:text-xl text-sm">Campaigns</span>
            </div>
          </div>
          <div className="flex flex-row items-center py-2">
            <TbCurrencyEthereum className="md:text-6xl text-3xl mr-2" />
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl font-bold text-[#302CED]">78</span>
              <span className="md:text-xl text-sm">Ethers</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
