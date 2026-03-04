// src/pages/NotFoundPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchX,
  ArrowLeft,
  MessageCircle,
  Target,
  LayoutGrid,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const navigate = useNavigate();

  // Fungsi navigasi ke kontak/konsultasi
  const handleContactClick = () => {
    navigate("/", { state: { scrollToSection: "contact" } });
  };

  return (
    <>
      <Helmet>
        <title>404: Halaman Tidak Ditemukan | OmzetNaik.id</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#F5F7FB] text-center px-6 relative overflow-hidden font-sans">
        {/* Dekorasi Background Soft */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#0F1F4A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-[#FF3B3B]/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-lg w-full py-12"
        >
          {/* Icon Visual dengan Branding Target */}
          <div className="mx-auto w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl shadow-[#0F1F4A]/5 border border-slate-100 flex items-center justify-center mb-10 relative">
            <div className="absolute inset-0 bg-[#FF3B3B]/10 rounded-[2.5rem] animate-ping opacity-20"></div>
            <SearchX className="text-[#FF3B3B]" size={56} strokeWidth={1.5} />
          </div>

          <h1 className="text-7xl md:text-9xl font-heading font-extrabold text-[#0F1F4A] mb-4 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-6">
            Opps! <span className="text-[#FF3B3B] italic">Tersesat?</span>
          </h2>

          <p className="text-slate-500 mb-12 leading-relaxed max-w-sm mx-auto font-medium">
            Halaman yang Anda cari tidak ditemukan. Mungkin telah dipindahkan
            atau tautan yang Anda gunakan sudah kedaluwarsa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0F1F4A] text-white font-bold rounded-2xl shadow-xl shadow-[#0F1F4A]/20 hover:bg-black transition-all hover:-translate-y-1 active:scale-95"
            >
              <ArrowLeft size={18} />
              Kembali ke Beranda
            </Link>

            <Link
              to="/properti"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0F1F4A] border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <LayoutGrid size={18} className="text-[#FF3B3B]" />
              Katalog Properti
            </Link>
          </div>

          {/* Footer Card khusus 404 */}
          <div className="mt-16 pt-10 border-t border-slate-200/60">
            <p className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">
              Butuh Strategi Marketing?
            </p>
            <button
              onClick={handleContactClick}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#FF3B3B]/5 text-[#FF3B3B] font-bold text-sm rounded-xl hover:bg-[#FF3B3B] hover:text-white transition-all duration-300 group"
            >
              <MessageCircle
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
              Konsultasi Strategi Gratis
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
