import React, { useState } from "react";
import { create, CID } from "ipfs-http-client";
import { Buffer } from "buffer";
import { CiImport } from "react-icons/ci";

const projectId = "2J7fbfBVkAAJZK4WgZXuAiyZaVk";
const projectSecret = "9711aec7170f5329f319681b5430602b";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});

const Page3 = ({ formData, setFormData, preview, setPreview }) => {
  const [file, setFile] = useState(null);

  const retrieveFile = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files);

    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    setFormData({
      ...formData,
      bannerUrl: "",
    });

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await ipfs.add(file);
      const url = `https://crypto-care.infura-ipfs.io/ipfs/${created.path}`;
      console.log(url);
      setFormData({
        ...formData,
        bannerUrl: url,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">Next, add campaign image or banner</h1>
        <div className="w-full mb-6 md:mb-0">
          <label className="block text-base font-bold">Upload your campaign banner.</label>
          <label className="block text-xs mb-2">Banners may contain invitations related to your campaign, they may not contain elements of sound, taste, and politics.</label>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="photo-campaign" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100">
            {preview ? (
              <div className="flex h-full justify-center p-2">
                {" "}
                <img src={preview} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CiImport className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to import</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG</p>
              </div>
            )}
          </label>
          <input id="photo-campaign" type="file" accept="image/png, image/jpeg, image/jpg" name="data" hidden onChange={retrieveFile} />
          <div className="relative my-3">
            <input
              type="text"
              id="campaign-banner-link"
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Blick 'Upload' button to generate your link image."
              value={formData.bannerUrl}
              required
              readOnly
              disabled
            />
            <button
              type="submit"
              disabled={file === null}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 disabled:cursor-not-allowed disabled:bg-red-200"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page3;
