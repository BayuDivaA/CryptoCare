import React from "react";
import { Link } from "react-router-dom";
import TutorialsButton from "./Button";

export default function TutorialPage() {
  return (
    <>
      <div className="bg-tutorial min-h-screen">
        <nav className="flex sticky justify-center items-center top-0 z-50 p-5 navbar-glass">
          <div className="items-center flex-initial cursor-pointer ">
            <Link to="/">
              <img src="../../images/LogoCC-black.png" alt="logo" className="w-44 hover:scale-105 transition ease-in-out" />
            </Link>
          </div>
        </nav>
        <TutorialsButton />
      </div>
    </>
  );
}
