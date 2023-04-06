import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsFillPatchQuestionFill, BsFillImageFill } from "react-icons/bs";
import { BiUserPin } from "react-icons/bi";
import { AiFillSetting } from "react-icons/ai";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserSettingDropdown({ verif, handleUsername, handlePhoto }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <AiFillSetting className="h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a onClick={handleUsername} className={`${classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")} + ${!verif && "hidden"} cursor-pointer`}>
                  <div className="flex items-center">
                    <BiUserPin className="mr-2" />
                    Username
                  </div>
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a onClick={handlePhoto} className={`${classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")} + ${!verif && "hidden"} cursor-pointer`}>
                  <div className="flex items-center">
                    <BsFillImageFill className="mr-2" />
                    Photo Profile
                  </div>
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfmnZAd77mtajxXMZilcSzHX3Le6I4ZORg5V_TfPSKLlUWi3g/viewform?usp=sf_link"
                  target="_blank"
                  className={`${classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")} + ${verif && "hidden"} cursor-pointer`}
                >
                  <div className="flex items-center">
                    <BsFillPatchQuestionFill className="mr-2" />
                    Verification
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
