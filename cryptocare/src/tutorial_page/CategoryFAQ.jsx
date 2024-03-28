import React from "react";
import faqData from "../utils/faqDummy";

const CategoryFAQ = () => {
  return (
    <div className="flex justify-center min-h-screen mt-10">
      <div className="w-5/6">
        {faqData.map((category, index) => (
          <div key={index}>
            <h2>{category.category}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFAQ;
