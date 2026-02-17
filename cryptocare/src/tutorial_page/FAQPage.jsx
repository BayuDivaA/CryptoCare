import React from "react";
import CategoryFAQ from "./CategoryFAQ";
import Navbar from "../homepage/component/Navbar";

export default function FAQPage() {
  return (
    <>
      <div className="gradient-bg-faq min-h-screen">
        <Navbar showList={false} />
        <CategoryFAQ />
      </div>
    </>
  );
}
