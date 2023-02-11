import React from "react";

export default function BannerDetail({ url }) {
  return (
    <div className="rounded-md mt-4">
      <img src={url} alt="BANNER CAMPAIGN" className="object-cover rounded-md h-60 w-full" />
    </div>
  );
}
