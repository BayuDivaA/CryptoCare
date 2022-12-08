import NavbarForm from "./components/NavbarForm";
import Page1a from "./components/pg1a.form";
import Page1b from "./components/pg1b.form";

const Form = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-form">
        <NavbarForm />
        <div className="md:mx-40">
          <div className="flex justify-center items-center py-3">
            <div className="flex w-5/6">
              <p className="">
                <span className="text-[#302CED]">Create Campaign </span> : 1 of 4
              </p>
            </div>
          </div>
          <Page1a />
          {/* <Page1b /> */}
        </div>
      </div>
    </div>
  );
};

export default Form;
