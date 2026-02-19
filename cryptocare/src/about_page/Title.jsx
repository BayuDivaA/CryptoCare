import React from "react";
import bgAbout from "../../images/bg-about.png";

const Title = () => {
  return (
    <div className="w-full bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${bgAbout})` }}>
      <div className="flex min-h-screen items-center justify-center bg-slate-900/55 px-4 py-4">
        <div className="mx-auto flex h-80 max-w-4xl items-center justify-center px-4">
          <div className="text-center">
            <p className="text-2xl font-bold uppercase text-white transition ease-in-out hover:scale-105 sm:text-4xl">The revolutionary fundraising platform.</p>
            <p className="mt-3 text-sm font-medium text-blue-100 sm:text-base">Secure, transparent, and community-driven giving.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
