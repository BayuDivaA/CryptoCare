import React from "react";
import Title from "./Title";
import About from "./About";
import Team from "./Team";
import Footer from "./Footer";
import Navbar from "../homepage/component/Navbar";

export default function AboutPage() {
  return (
    <>
      <div className="gradient-bg-welcome min-h-screen ">
        <Navbar showList={true} />
        <Title />
        <About />
        <Team />
        <Footer />
      </div>
    </>
  );
}
