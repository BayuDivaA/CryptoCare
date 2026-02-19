import React from "react";
import { FiShield, FiZap, FiEye } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const highlights = [
  {
    title: "Transparent by Design",
    desc: "Every donation flow can be verified on-chain.",
    icon: FiEye,
  },
  {
    title: "Efficient L2",
    desc: "Optimistic Rollups keep transactions faster and cheaper.",
    icon: FiZap,
  },
  {
    title: "Secure Execution",
    desc: "Campaign funding logic runs through smart contracts.",
    icon: FiShield,
  },
];

const About = () => {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="my-6 w-full max-w-6xl rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-5 flex items-center justify-center gap-2">
          <HiOutlineSparkles className="h-5 w-5 text-blue-700" />
          <p className="text-center text-2xl font-bold tracking-tight text-blue-gray-900 sm:text-4xl">About</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="rounded-xl bg-[#f8fafc] p-4 shadow-sm sm:p-5">
            <p className="mb-2 text-justify text-base leading-relaxed text-blue-gray-900 sm:text-lg">
              We are a team committed to making fundraising easier, transparent, and secure. With <i>Optimistic Rollups</i>, we provide an efficient and affordable way to launch and manage donation campaigns for social and technology-driven
              initiatives.
            </p>
            <p className="mb-2 text-justify text-base leading-relaxed text-blue-gray-900 sm:text-lg">
              Every donation is transparently recorded on-chain, so supporters can verify where funds are going. By leveraging L2, we reduce gas costs and improve transaction speed to make participation more practical for everyone.
            </p>
            <div className="mt-4 rounded-xl bg-[#e8f0ff] px-4 py-3">
              <p className="text-sm font-medium text-blue-gray-900 sm:text-base">
                Our mission is to build a donation experience based on trust, clarity, and long-term reliability.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#0f172a] p-4 shadow-md sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Core Principles</p>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="mb-2 inline-flex rounded-full bg-blue-50 p-2 text-blue-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-blue-gray-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-blue-gray-700">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-blue-gray-700 sm:text-base">Thank you for choosing our platform to start your fundraising journey.</p>
      </div>
    </section>
  );
};

export default About;
