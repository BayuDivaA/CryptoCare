import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { BsFlag, BsFlagFill } from "react-icons/bs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReportRefundDropdown({ handleReport, handleRefund, alreadyReported }) {
  return (
    <Menu as="div" className="md:relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white p-2 text-sm font-medium shadow-lg text-gray-700 hover:bg-gray-100">
          <BsThreeDotsVertical className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a onClick={handleReport} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm cursor-pointer")}>
                  <div className="flex items-center">
                    <BsFlag className="mr-2" />
                    Report
                  </div>
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a onClick={handleRefund} className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm cursor-pointer")}>
                  <div className="flex items-center">
                    <HiOutlineReceiptRefund className="mr-2" />
                    Refund
                  </div>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
