import React, { useState } from "react";

export default function BannerDetail({ url }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="mt-4 overflow-hidden rounded-md">
      <div className="relative aspect-[16/9] w-full bg-blue-gray-100">
        {isLoading && <div className="absolute inset-0 animate-pulse bg-blue-gray-100" />}
        {!isError ? (
          <img
            src={url}
            alt="BANNER CAMPAIGN"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setIsError(true);
            }}
            className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-blue-gray-400">Banner unavailable</div>
        )}
      </div>
    </div>
  );
}
