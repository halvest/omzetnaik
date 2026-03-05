// src/components/Hero.tsx
import React from "react";
import {
  ArrowRight,
  Target,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onSectionChange?: (section: string) => void;
}

export default function Hero({ onSectionChange }: HeroProps) {
  return (
    // Padding top ditingkatkan (pt-32 di mobile, lg:pt-44 di desktop) agar benar-benar turun dari header
    <section className="relative min-h-[90vh] lg:h-screen flex items-center pt-32 lg:pt-44 overflow-hidden bg-[#0F1F4A]">
      {/* SEO Semantics */}
      <h2 className="sr-only">
        OmzetNaik.id - Digital Agency Partner Strategis: Marketing, Advertising
        & Branding
      </h2>

      {/* REFINED AMBIANCE */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3B3B]/10 rounded-full blur-[150px] -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[130px] -ml-20 -mb-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* LEFT CONTENT: Visual Hierarchy Optimized */}
          <div className="w-full lg:w-[65%] text-center lg:text-left order-2 lg:order-1">
            {/* Tag Digital Agency Partner dengan margin top ekstra (mt-8) agar lega di desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 shadow-sm mt-8 lg:mt-16"
            >
              <Target className="w-3.5 h-3.5 text-[#FF3B3B]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                Digital Agency Partner
              </span>
            </motion.div>

            {/* Headline: Compact 2-Line Desktop Layout */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-[4.6rem] font-black leading-[1.1] mb-8 text-white tracking-tighter"
            >
              Meroketkan <span className="text-[#FF3B3B]">Omzet Bisnis</span>{" "}
              <br className="hidden lg:block" />
              ke Level Selanjutnya.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Partner strategis untuk mendominasi pasar melalui strategi
              <strong>
                {" "}
                Digital Marketing, Advertising, Branding, dan Promosi
              </strong>
              &nbsp; yang terukur untuk memastikan brand Anda tumbuh dan
              <strong className="text-white font-bold"> menghasilkan.</strong>
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <button
                onClick={() => onSectionChange?.("contact")}
                className="w-full sm:w-auto bg-[#FF3B3B] hover:bg-white hover:text-[#0F1F4A] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 transition-all flex items-center justify-center gap-3 group"
              >
                Mulai Konsultasi Gratis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="flex items-center gap-3 px-6 py-2 border-l border-white/10 hidden sm:flex">
                <ShieldCheck className="text-emerald-500" size={24} />
                <div className="text-left">
                  <p className="text-[10px] font-black text-white uppercase leading-tight">
                    Strategi
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Terukur
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-20 flex flex-col sm:flex-row items-center gap-6 border-t border-white/5 pt-10"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#0F1F4A] bg-slate-800 overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-500"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?u=${i + 25}`}
                      alt="Client"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] text-center lg:text-left">
                Membantu{" "}
                <span className="text-white font-black">50+ Brand Tumbuh</span>{" "}
                & Menghasilkan
              </p>
            </motion.div>
          </div>

          {/* RIGHT CONTENT: Rocket Visual - Hidden on Mobile */}
          <div className="hidden lg:flex lg:w-[32%] order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-[4rem] border border-white/[0.03] animate-[spin_30s_linear_infinite]" />

              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 p-12 lg:p-16 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[4.5rem] border border-white/10 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center group"
              >
                <Rocket
                  size={140}
                  className="text-white drop-shadow-[0_0_40px_rgba(255,59,59,0.3)] rotate-45 group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute bottom-10 flex items-center gap-2 bg-[#FF3B3B] px-4 py-2 rounded-full shadow-xl">
                  <TrendingUp className="text-white" size={14} />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                    Scale Up
                  </span>
                </div>
              </motion.div>

              <Sparkles
                className="absolute -top-4 -left-4 text-[#FF3B3B]/30 animate-pulse"
                size={40}
              />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
