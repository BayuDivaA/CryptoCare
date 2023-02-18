import { Popover, Transition } from "@headlessui/react";
import { IoMdNotifications } from "react-icons/io";
import { Fragment } from "react";
import { getPhotoUrl } from "../../smart_contract/SmartcontractInteract";
import { useEthers, useNotifications } from "@usedapp/core";
import { shortenAddress } from "../../utils/shortenAddress";

const solutions = [
  {
    name: "Insights",
    description: "Measure actions your users take",
    href: "##",
    icon: IconOne,
  },
  {
    name: "Reports",
    description: "Keep track of your growth",
    href: "##",
    icon: IconThree,
  },
];

export default function NotificationDropdown() {
  const { account } = useEthers();
  const photoUrl = getPhotoUrl(account);
  const { notifications } = useNotifications();

  return (
    <div className="mr-3 ">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="items-center flex">
              <IoMdNotifications
                className={`${open ? "" : "text-opacity-70"}
                  h-8 w-8 text-blue-900 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 w-screen mt-3 max-w-sm -translate-x-1/2 transform px-4 sm:px-0 ">
                <div className="overflow-hidden rounded-lg shadow-lg ">
                  <div className="relative grid gap-4 bg-white p-7 ">
                    {notifications.length === 0 ? (
                      <div className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 justify-center italic">Empty</div>
                    ) : (
                      notifications.map((notification) => {
                        return (
                          <div key={notification.id} className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50">
                            {notification.type === "walletConnected" && (
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Connect to {shortenAddress(notification.address)}</p>
                                <p className="text-sm text-gray-500">{new Date(notification.submittedAt).toLocaleTimeString()}</p>
                              </div>
                            )}
                            {notification.type === "transactionStarted" && (
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Starting transaction for {notification.transactionName}</p>
                                <p className="text-sm text-gray-500">{new Date(notification.submittedAt).toLocaleDateString()}</p>
                              </div>
                            )}
                            {notification.type === "transactionSucceed" && (
                              <a href={"https://goerli-optimism.etherscan.io/tx/" + notification.transaction.hash} target="_blank" className="">
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900">Transaction Success</p>
                                </div>
                                <div className="">
                                  <p className="text-sm font-medium text-gray-900">Transaction Success</p>
                                  <p className="text-sm text-gray-500">{new Date(notification.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm text-gray-500 hover:text-blue-600">See</p>
                              </a>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

function IconOne() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z" stroke="#FB923C" strokeWidth="2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z" stroke="#FDBA74" strokeWidth="2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z" stroke="#FDBA74" strokeWidth="2" />
    </svg>
  );
}

function IconTwo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27" stroke="#FB923C" strokeWidth="2" />
      <path fillRule="evenodd" clipRule="evenodd" d="M18.804 30H29.1963L24.0001 21L18.804 30Z" stroke="#FDBA74" strokeWidth="2" />
    </svg>
  );
}

function IconThree() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
      <rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
      <rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
      <rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
      <rect x="29" y="16" width="2" height="20" fill="#FB923C" />
      <rect x="33" y="12" width="2" height="24" fill="#FB923C" />
    </svg>
  );
}
