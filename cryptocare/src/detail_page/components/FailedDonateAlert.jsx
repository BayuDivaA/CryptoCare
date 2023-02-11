import React, { useState } from "react";

export default function FailedAlert() {
  const [failAlert, setFailAlert] = useState(true);

  function dissmissAlert() {
    setFailAlert(false);
  }
  return (
    <>
      {failAlert && (
        <div className="flex flex-col fixed jusctify-center top-0 right-0 m-5">
          <div id="alert-additional-content-2" class="p-4 mb-4 text-red-900 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-900" role="alert">
            <div class="flex items-center">
              <svg aria-hidden="true" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <span class="sr-only">Info</span>
              <h3 class="text-lg font-medium">Failed Transaction</h3>
            </div>
            <div class="mt-2 mb-4 text-sm">Your transaction failed, please try again.</div>
            <div class="flex">
              <button type="button" onClick={dissmissAlert} class="text-red-900 bg-transparent border border-red-900 hover:bg-red-900 hover:text-white font-medium rounded-lg text-xs px-3 py-1.5 text-center">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
