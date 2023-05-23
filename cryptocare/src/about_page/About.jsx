import React from "react";

const About = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="my-6 w-4/6 ">
        <p className="text-center font-bold md:text-4xl text-xl mb-4 text-blue-gray-90">About</p>
        <p className="text-justify mb-2 text-lg">
          We are a team committed to making fundraising easier, transparent, and secure. With <i>Optimistic Rollups</i> technology, we offer an efficient and affordable solution to facilitate fundraising. Through our platform, fundraisers
          can create campaigns and raise funds for a variety of projects, ranging from social to technological.
        </p>
        <p className="text-justify mb-2 text-lg">
          Each donation is transparently recorded and verified on the blockchain, allowing donors to ensure that their funds are used properly. By using <i>Optimistic Rollups</i> technology, we can speed up transactions and lower gas costs,
          making it easier and more efficient for users to participate in fundraising. We are committed to continuously improving the user experience and ensuring that every fundraising campaign on our platform is successful.
        </p>
        <p className="text-justify text-lg">Thank you for choosing our platform to start your fundraising journey!</p>
      </div>
    </div>
  );
};

export default About;
