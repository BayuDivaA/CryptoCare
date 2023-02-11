import { useState } from "react";
import { create, CID } from "ipfs-http-client";

const projectId = "2J7fbfBVkAAJZK4WgZXuAiyZaVk";
const projectSecret = "9711aec7170f5329f319681b5430602b";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
  url: "https://ipfs.infura.io:5001",
  headers: {
    authorization,
  },
});

function IPFSClient() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState();

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };
    setPreview(URL.createObjectURL(e.target.files[0]));

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await ipfs.add(file);
      const url = `https://crypto-care.infura-ipfs.io/ipfs/${created.path}`;
      console.log(url);
      setUrl(url);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <form className="form" onSubmit={handleSubmit}>
        <label
          htmlFor="photo-campaign"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          {preview ? (
            <div className="flex h-full justify-center p-2">
              <img src={preview} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
          )}
        </label>
        <input id="photo-campaign" type="file" name="data" hidden onChange={retrieveFile} />
        <button type="submit" className="btn my-2 justify-center">
          Upload file
        </button>
      </form>
      <div className="">
        {url ? (
          <input
            className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="campaign-name"
            type="text"
            placeholder="Banner Uploaded Link"
            value={url}
            readOnly
          />
        ) : (
          <input
            className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="campaign-name"
            type="text"
            placeholder="Banner Uploaded Link"
            readOnly
          />
        )}
      </div>
    </div>
  );
}

export default IPFSClient;
