import Page1a from "./components/pg1a.form";
import Page1b from "./components/pg1b.form";
import Page2 from "./components/pg2.form";
import Page3 from "./components/pg3.form";
import Page4 from "./components/pg4.form";
import Page5 from "./components/pg5.summary";
import Navbar from "../homepage/component/Navbar";

const Form = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-form">
        <Navbar showList={false} />
        <div className="md:mx-40">
          <div className="flex justify-center items-center py-3">
            <div className="flex w-5/6">
              <p className="">
                <span className="text-[#302CED]">Create Campaign </span> : 1 of 4
              </p>
            </div>
          </div>
          {/* <Page1a /> */}
          {/* <Page1b /> */}
          {/* <Page2 /> */}
          {/* <Page3 /> */}
          {/* <Page4 /> */}
          <Page5 />
        </div>
      </div>
    </div>
  );
};

export default Form;
