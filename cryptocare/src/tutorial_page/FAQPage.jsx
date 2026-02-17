import React from "react";
import { Link } from "react-router-dom";
import CategoryFAQ from "./CategoryFAQ";
import logo from "../../images/LogoCC-black.png";

export default function FAQPage() {
  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f4f9ff_0%,#edf4ff_45%,#e8f0ff_100%)]">
        <nav className="sticky top-0 z-50 border-b border-[#d8e4ff]/70 bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link to="/">
              <img src={logo} alt="logo" className="w-36 transition ease-in-out hover:scale-105 sm:w-44" />
            </Link>
            <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-semibold text-[#2f57c2] sm:text-sm">Help Center</span>
          </div>
        </nav>
        <CategoryFAQ />
      </div>
    </>
  );
}
