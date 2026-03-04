// src/components/Hero.tsx
import React from "react";
import {
  ArrowRight,
  BarChart3,
  Target,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onSectionChange?: (section: string) => void;
}

export default function Hero({ onSectionChange }: HeroProps) {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 lg:pt-32 overflow-hidden bg-[#0F1F4A]">
      {/* BACKGROUND ELEMENTS - Optimized for Performance */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3B3B]/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* LEFT CONTENT: Empathy & Clarity (Design Thinking) */}
          <div className="w-full lg:w-[55%] text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-6 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF3B3B]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                Performance Marketing Expert
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-[5.5rem] font-black leading-[1.05] mb-6 text-white tracking-tighter"
            >
              Ubah Klik Jadi <br />
              <span className="text-[#FF3B3B] italic">Omzet Naik</span>{" "}
              <br className="hidden md:block" />
              Signifikan.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Kami tidak sekadar beriklan. Kami membangun{" "}
              <span className="text-white">Growth Engine</span> otomatis untuk
              bisnis properti dan UMKM berbasis data Meta & Google Ads.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => onSectionChange?.("contact")}
                className="w-full sm:w-auto bg-[#FF3B3B] hover:bg-white hover:text-[#0F1F4A] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 transition-all flex items-center justify-center gap-3 group"
              >
                Mulai Konsultasi
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => onSectionChange?.("portfolio")}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white hover:bg-white hover:text-[#0F1F4A] transition-all"
              >
                Lihat Portfolio
              </button>
            </motion.div>

            {/* TRUST INDICATORS - Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-4 lg:gap-6 border-t border-white/5 pt-10"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#0F1F4A] bg-slate-800 overflow-hidden shadow-xl"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      alt="client"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center lg:text-left">
                Dipercaya oleh{" "}
                <span className="text-white font-black">
                  50+ Bisnis Properti
                </span>{" "}
                & UMKM
              </p>
            </motion.div>
          </div>

          {/* RIGHT CONTENT: Evidence & Trust (Viability) */}
          <div className="w-full lg:w-[45%] order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative p-6 md:p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-3xl group"
            >
              {/* Animated Performance Graph (Simple SVG for performance) */}
              <div className="h-48 md:h-64 flex items-end justify-between gap-1.5 md:gap-3 mb-10">
                {[45, 60, 40, 85, 55, 100, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="flex-1 bg-gradient-to-t from-[#FF3B3B] to-red-400/50 rounded-t-xl group-hover:from-white group-hover:to-white/50 transition-colors"
                  />
                ))}
              </div>

              {/* Real-time Metrics Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4">
                  <div className="p-3 bg-[#FF3B3B]/20 rounded-2xl">
                    <MousePointer2 className="w-5 h-5 text-[#FF3B3B]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      Growth Rate
                    </p>
                    <p className="text-xl font-black text-white">+182%</p>
                  </div>
                </div>
                <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      Avg. ROAS
                    </p>
                    <p className="text-xl font-black text-white">5.4x</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-2xl rotate-12 hidden md:block">
                <p className="text-[10px] font-black text-[#0F1F4A] uppercase tracking-widest leading-none mb-1">
                  Live Report
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 tracking-tighter">
                    System Active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
