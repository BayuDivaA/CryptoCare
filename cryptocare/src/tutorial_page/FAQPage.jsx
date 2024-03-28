import React from "react";
import { Link } from "react-router-dom";
import CategoryFAQ from "./CategoryFAQ";
export default function FAQPage() {
  return (
    <>
      <div className="min-h-screen bg-tutorial">
        <nav className="sticky top-0 z-50 flex items-center justify-center p-5 navbar-glass">
          <div className="items-center flex-initial cursor-pointer ">
            <Link to="/">
              <img src="../../images/LogoCC-black.png" alt="logo" className="transition ease-in-out w-44 hover:scale-105" />
            </Link>
          </div>
        </nav>
        <CategoryFAQ />
      </div>
    </>
  );
}
