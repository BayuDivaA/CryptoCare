import React, { useMemo, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { FiHeart, FiShield, FiUsers } from "react-icons/fi";
import faqData from "../utils/faqDummy";

const iconByCategory = {
  "Donation and Payment": FiHeart,
  "Security and Transparency": FiShield,
  "Account Management and Registration": FiUsers,
  "Platform Rules and Protection": FiShield,
};

function FAQItem({ item }) {
  return (
    <Disclosure as="div" className="rounded-2xl border border-[#dbe5ff] bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5">
            <span className="text-sm font-semibold text-[#1c2f52] sm:text-base">{item.question}</span>
            <HiOutlineChevronDown className={`h-5 w-5 text-[#365fcb] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-out"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-200 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <Disclosure.Panel className="px-4 pb-4 text-sm text-[#3f4e6b] sm:px-5">
              <ul className="list-disc space-y-1 pl-5">
                {item.answer.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

const CategoryFAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqData = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return faqData;

    return faqData
      .map((category) => {
        const matchedQuestions = category.questions.filter((item) => {
          const inQuestion = item.question.toLowerCase().includes(keyword);
          const inAnswer = item.answer.some((line) => line.toLowerCase().includes(keyword));
          return inQuestion || inAnswer;
        });

        return {
          ...category,
          questions: matchedQuestions,
        };
      })
      .filter((category) => category.questions.length > 0);
  }, [searchQuery]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#eff5ff] to-[#f7fbff] p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-[#1c2f52] sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#4a628d] sm:text-base">Everything you need to know about donations, campaign verification, fund safety, and wallet usage in Crypto Charity.</p>
        <div className="mt-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-xl border border-[#d7e4ff] bg-white px-4 py-2.5 text-sm text-[#1c2f52] shadow-sm outline-none transition-all placeholder:text-[#7a8db3] focus:border-[#4a73df] focus:ring-2 focus:ring-[#c9d9ff]"
          />
        </div>
      </div>

      <div className="space-y-5">
        {filteredFaqData.map((category) => {
          const Icon = iconByCategory[category.category] || FiHeart;
          return (
            <div key={category.category} className="rounded-3xl border border-[#dbe5ff] bg-white/95 p-4 shadow-sm sm:p-6">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#eef4ff] px-4 py-2 text-[#2d58c6]">
                <Icon className="mr-2 h-4 w-4" />
                <h2 className="text-sm font-semibold sm:text-base">{category.category}</h2>
              </div>
              <div className="space-y-3">
                {category.questions.map((item) => (
                  <FAQItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}

        {filteredFaqData.length === 0 && (
          <div className="rounded-2xl border border-[#dbe5ff] bg-white px-5 py-8 text-center text-sm text-[#4a628d]">
            No matching FAQs found for "<span className="font-semibold">{searchQuery}</span>".
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryFAQ;
