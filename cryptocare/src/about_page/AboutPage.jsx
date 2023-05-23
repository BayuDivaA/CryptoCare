import React from "react";
import logo from "../../images/LogoCC-black.png";
import Title from "./Title";
import About from "./About";
import Team from "./Team";
import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <>
      <div className="gradient-bg-welcome min-h-screen">
        <nav className="flex sticky justify-center items-center top-0 z-50 p-5 navbar-glass">
          <div className="items-center flex-initial cursor-pointer ">
            <Link to="/">
              <img src={logo} alt="logo" className="w-44 hover:scale-105 transition ease-in-out" />
            </Link>
          </div>
        </nav>
        <Title />
        <About />
        <Team />
        <Footer />
      </div>
    </>
  );
}
