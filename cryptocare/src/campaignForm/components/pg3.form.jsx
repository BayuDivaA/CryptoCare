import React, { useState } from "react";
import { CiImport } from "react-icons/ci";
import { toast, Flip } from "react-toastify";

const pinataJwt = import.meta.env.VITE_PINATA_JWT;

async function uploadToPinata(file, jwt) {
  const payload = new FormData();
  payload.append("file", file);

  // Legacy Pinata pinning endpoint
  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: payload,
    });
    const data = await response.json();

    if (response.ok && data?.IpfsHash) {
      return data.IpfsHash;
    }
  } catch (_err) {
    // try fallback endpoint below
  }

  // New Pinata uploads endpoint
  const fallbackPayload = new FormData();
  fallbackPayload.append("file", file);
  const fallbackResponse = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: fallbackPayload,
  });

  const fallbackData = await fallbackResponse.json();
  if (fallbackResponse.ok && (fallbackData?.data?.cid || fallbackData?.cid)) {
    return fallbackData?.data?.cid || fallbackData?.cid;
  }

  throw new Error(
    fallbackData?.error?.reason ||
      fallbackData?.error ||
      "Request gagal ke Pinata (kemungkinan CORS/network/JWT)."
  );
}

const Page3 = ({ formData, setFormData, preview, setPreview }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (!data) return;
    setPreview(URL.createObjectURL(data));
    setFile(data);

    setFormData({
      ...formData,
      bannerUrl: "",
    });

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pinataJwt) {
      toast.error("Pinata config belum di-set. Isi VITE_PINATA_JWT di .env", {
        autoClose: 6000,
        transition: Flip,
      });
      return;
    }
    if (!file) return;

    setIsUploading(true);
    try {
      const loading = toast.loading("Uploading banner to IPFS...", {
        autoClose: false,
      });

      const cid = await uploadToPinata(file, pinataJwt);
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      setFormData({
        ...formData,
        bannerUrl: url,
      });
      toast.update(loading, {
        render: "Banner uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 4000,
        transition: Flip,
      });
    } catch (error) {
      toast.error(`Upload failed: ${error?.message || "Unknown error"}. Cek koneksi/adblock dan JWT Pinata.`, {
        autoClose: 7000,
        transition: Flip,
      });
    } finally {
      setIsUploading(false);
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
              disabled={file === null || isUploading}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 disabled:cursor-not-allowed disabled:bg-red-200"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page3;
