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
    <section className="relative min-h-screen flex items-center pt-24 lg:pt-32 overflow-hidden bg-primary-dark">
      {/* SEO Semantics */}
      <h2 className="sr-only">
        OmzetNaik.id - Digital Agency Partner Strategis: Marketing, Advertising
        & Branding
      </h2>

      {/* REFINED AMBIANCE (Silicon Valley Glow Style) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-primary-light/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[60%] text-center lg:text-left">
            {/* Badge: Refined Tracking & Border */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md shadow-premium"
            >
              <Target className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300">
                Digital Agency Partner
              </span>
            </motion.div>

            {/* Headline: Premium Gradient & Tight Tracking */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0, 0, 1] }}
              className="text-5xl md:text-7xl lg:text-[4rem] font-bold leading-[1.05] mb-8 text-white tracking-tighter"
            >
              Meroketkan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">
                Omzet Bisnis
              </span>{" "}
              <br className="hidden lg:block" />
              ke Level Selanjutnya.
            </motion.h1>

            {/* Paragraph: Optimized Line Height & Color */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Partner strategis untuk mendominasi pasar melalui strategi
              <span className="text-slate-200">
                {" "}
                Digital Marketing, Advertising, Branding, dan Promosi
              </span>
              &nbsp; yang terukur untuk memastikan brand Anda tumbuh dan
              <span className="text-white font-semibold italic">
                {" "}
                menghasilkan.
              </span>
            </motion.p>

            {/* CTA Group: Modern Sizing & Interaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <button
                onClick={() => onSectionChange?.("contact")}
                className="btn-primary group !px-10 !py-4 !text-sm tracking-normal font-bold"
              >
                Mulai Konsultasi Gratis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="flex items-center gap-3 px-6 py-2 border-l border-white/10 hidden sm:flex">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <ShieldCheck className="text-emerald-500" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-1">
                    Strategi
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none">
                    Terukur
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Proof: Clean & Trusted */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-col sm:flex-row items-center gap-6 border-t border-white/5 pt-10"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-primary-dark bg-slate-800 overflow-hidden shadow-premium transition-transform hover:-translate-y-1"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?u=${i + 25}`}
                      alt="Client avatar"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[12px] font-medium text-slate-400 tracking-wide text-center lg:text-left">
                Membantu{" "}
                <span className="text-white font-bold">50+ Brand Tumbuh</span> &
                Menghasilkan omzet maksimal secara berkelanjutan.
              </p>
            </motion.div>
          </div>

          {/* RIGHT CONTENT: Premium Floating Visual */}
          <div className="hidden lg:flex lg:w-[35%] justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.2, 0, 0, 1] }}
              className="relative w-full aspect-square"
            >
              {/* Animated Orbit Rings */}
              <div className="absolute inset-0 rounded-[4rem] border border-white/[0.05] animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-10 rounded-[3rem] border border-white/[0.03] animate-[spin_25s_linear_infinite_reverse]" />

              <motion.div
                animate={{ y: [0, -25, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                {/* Main Card Glassmorphism */}
                <div className="p-16 bg-gradient-to-br from-white/[0.08] to-transparent rounded-[bento] border border-white/10 backdrop-blur-2xl shadow-premium-hover group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <Rocket
                    size={120}
                    className="text-white drop-shadow-[0_0_50px_rgba(255,59,59,0.5)] rotate-45 group-hover:scale-110 transition-transform duration-1000 ease-premium"
                  />

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-accent px-5 py-2.5 rounded-full shadow-accent-glow">
                    <TrendingUp className="text-white" size={16} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] whitespace-nowrap">
                      Scale Up
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Accents */}
              <Sparkles
                className="absolute top-0 right-0 text-accent/40 animate-pulse"
                size={48}
              />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary-light/20 rounded-full blur-3xl animate-float" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
