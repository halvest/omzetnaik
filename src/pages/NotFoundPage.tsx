// src/pages/NotFoundPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchX,
  ArrowLeft,
  MessageCircle,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/", { state: { scrollToSection: "contact" } });
  };

  return (
    <>
      <Helmet>
        <title>404: Terminal Not Found | OmzetNaik.id</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-6 relative overflow-hidden font-sans">
        {/* --- DYNAMIC BACKGROUND DECOR --- */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="relative z-10 max-w-xl w-full py-20"
        >
          {/* --- ICON VISUAL (Bento Style) --- */}
          <div className="relative mx-auto w-36 h-36 mb-12">
            <div className="absolute inset-0 bg-accent/10 rounded-[3rem] animate-pulse scale-110" />
            <div className="relative w-full h-full bg-white rounded-[3rem] shadow-premium border border-slate-100 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  y: [0, -5, 0],
                }}
                transition={{ repeat: Infinity, duration: 6 }}
              >
                <SearchX className="text-accent" size={64} strokeWidth={1.2} />
              </motion.div>
              {/* Glitch Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-20" />
            </div>
          </div>

          {/* --- TEXT CONTENT --- */}
          <div className="space-y-4 mb-12">
            <h1 className="text-8xl md:text-[12rem] font-bold text-primary tracking-tighter leading-none opacity-10 absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none">
              404
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
                Oops! Jalur{" "}
                <span className="text-accent italic underline decoration-accent/20 underline-offset-8">
                  Terputus.
                </span>
              </h2>
            </motion.div>

            <p className="text-slate-500 text-lg md:text-xl max-w-md mx-auto font-medium leading-relaxed">
              Halaman yang Anda tuju telah berpindah orbit atau belum pernah
              dipublikasikan dalam sistem kami.
            </p>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/"
              className="btn-primary !px-10 !py-4 flex items-center gap-3 shadow-accent-glow group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Kembali ke Orbit
            </Link>

            <Link
              to="/properti"
              className="px-10 py-4 bg-white text-primary border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 hover:border-primary/20 transition-all shadow-sm active:scale-95 flex items-center gap-3"
            >
              <LayoutGrid size={18} className="text-accent" />
              Katalog Properti
            </Link>
          </div>

          {/* --- SECONDARY CONVERSION PATH --- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-10 border-t border-slate-200/60"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-slate-100 rounded-full">
              <Sparkles size={12} className="text-accent" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Ingin Omzet Bisnis Naik?
              </span>
            </div>

            <div className="block">
              <button
                onClick={handleContactClick}
                className="group relative inline-flex items-center gap-3 text-primary font-bold hover:text-accent transition-colors duration-300"
              >
                <MessageCircle
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="text-lg tracking-tight">
                  Konsultasi Strategi Gratis
                </span>
                <ChevronRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// Catatan: Pastikan ikon 'ChevronRight' diimport dari 'lucide-react'
