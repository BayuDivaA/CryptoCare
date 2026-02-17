import React from "react";
import { SiEthereum } from "react-icons/si";
import useEthFiatPrices from "../../utils/useEthFiatPrices";

const Page4 = ({ formData, setFormData }) => {
  const { usd: etherPriceUsd, idr: etherPriceIDR, ready } = useEthFiatPrices();
  const targetEth = Number(formData.target || 0);
  const targetUsd = targetEth * etherPriceUsd;
  const targetIdr = targetEth * etherPriceIDR;

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      currency: "IDR",
    }).format(number);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">
          Next, set the target and deadline <br />
          for the fundraising
        </h1>
        <form className="w-full py-5">
          <div className="flex -mx-3 pb-6 ">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="fund-campaign">
                How much is needed for fundraising?
              </label>
              <label className="block text-xs mb-2" htmlFor="fund-campaign">
                Determine the amount of funds needed in Ether, and it will automatically display the conversion in USD and IDR
              </label>
              <div className="md:grid md:grid-cols-12 flex-col gap-2">
                <div className="flex md:col-span-6 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SiEthereum className=" text-base font-bold text-[#302CED]" />
                  </div>
                  <input
                    type="number"
                    id="target-form"
                    min="0.05"
                    step=".05"
                    value={formData.target}
                    className="bg-gray-200 border border-gray-200 text-gray-900 text-base rounded-lg focus:ring-blue-500 block w-full pl-10 p-2.5 focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="0.005"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        target: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex md:col-span-3 text-sm justify-between text-[#302CED] italic w-full items-center p-2.5">
                  <h1>$</h1>
                  <h1>
                    {ready ? targetUsd.toFixed(3) : "Rate unavailable"}
                  </h1>
                </div>
                <div className="flex md:col-span-3 text-sm justify-between text-[#302CED] italic w-full items-center p-2.5">
                  <h1>Rp</h1>
                  <h1>{ready ? rupiah(targetIdr) : "Rate unavailable"}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex pb-6">
            <div className="w-full mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="fund-campaign">
                Set a minimum donation?
              </label>
              <label className="block text-xs mb-2" htmlFor="fund-campaign">
                donors can still make donations, but cannot vote if the donation amount is less than the specified minimum donation amount.
              </label>
              <div className="flex md:w-1/2 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SiEthereum className=" text-base font-bold text-[#302CED]" />
                </div>
                <input
                  type="number"
                  id="minimal-donations"
                  value={formData.minimum}
                  step=".05"
                  min="0"
                  className="bg-gray-200 border border-gray-200 text-gray-900 text-base rounded-lg focus:ring-blue-500 block w-full pl-10 p-2.5 focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="0.005"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      minimum: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {formData.campaignType === 1 && (
            <div className="flex -mx-3 ">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block text-base font-bold" htmlFor="fund-campaign">
                  How long will your campaign run?
                </label>
                <label className="block text-xs mb-2" htmlFor="fund-campaign">
                  Choose the time that suits you and you need for your donation activity.
                </label>
                <div className="md:grid md:grid-cols-8 grid grid-cols-4 gap-2">
                  {[3, 7, 30, 60].map((durations, i) => (
                    <div key={i} className="flex col-span-2 items-center pl-4 rounded-lg border border-gray-200 bg-gray-200 ">
                      <input
                        id={durations}
                        type="radio"
                        value={durations}
                        name="duration-radio"
                        checked={formData.duration == durations}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            duration: e.target.value,
                          });
                        }}
                        className="w-5 h-5  bg-gray-100 border-gray-300 cursor-pointer text-[#302CED]"
                      />
                      <label htmlFor={durations} className="py-2 ml-2 w-full text-base font-medium cursor-pointer">
                        {durations} Days
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Page4;
