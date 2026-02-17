import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import logo from "../../images/LogoCC-black.png";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f7faff_0%,#eef4ff_48%,#e7efff_100%)]">
      <nav className="sticky top-0 z-50 border-b border-[#d8e4ff]/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/">
            <img src={logo} alt="logo" className="w-36 transition ease-in-out hover:scale-105 sm:w-44" />
          </Link>
          <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-semibold text-[#2f57c2] sm:text-sm">Contact Us</span>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-blue-100/60 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2f57c2]">Crypto Charity</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#0f1f4a] sm:text-4xl">Let&apos;s Talk</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4b5f8f] sm:text-base">
            Jika kamu punya pertanyaan tentang campaign, transaksi, atau kendala wallet, tim kami siap bantu.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#dfe8ff] bg-[#f8fbff] p-4">
              <div className="mb-2 inline-flex rounded-full bg-white p-2 text-[#2f57c2]">
                <HiOutlineMail className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-[#11255d]">Email</p>
              <p className="mt-1 text-sm text-[#4b5f8f]">support@cryptocare.id</p>
            </div>

            <div className="rounded-2xl border border-[#dfe8ff] bg-[#f8fbff] p-4">
              <div className="mb-2 inline-flex rounded-full bg-white p-2 text-[#2f57c2]">
                <FiClock className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-[#11255d]">Jam Operasional</p>
              <p className="mt-1 text-sm text-[#4b5f8f]">Senin - Jumat, 09:00 - 18:00 WIB</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#dfe8ff] bg-[#f8fbff] p-4">
            <div className="mb-2 inline-flex rounded-full bg-white p-2 text-[#2f57c2]">
              <HiOutlineLocationMarker className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[#11255d]">Lokasi</p>
            <p className="mt-1 text-sm text-[#4b5f8f]">Remote-first team, Indonesia</p>
          </div>

          <div className="mt-8 border-t border-[#e8eeff] pt-5 text-xs text-[#6d7faa]">
            Untuk isu transaksi mendesak, sertakan wallet address dan tx hash saat menghubungi support.
          </div>
        </div>
      </main>
    </div>
  );
}
