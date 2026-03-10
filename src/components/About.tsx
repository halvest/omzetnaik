// src/components/About.tsx
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";
import logoDark from "../assets/images/main_logo_dark.png";

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-slate-50 overflow-hidden py-20 lg:py-40 font-sans"
    >
      <h2 className="sr-only">
        Tentang OmzetNaik.id - Digital Agency Kreatif & Strategis
      </h2>

      {/* REFINED BACKGROUND DECOR (Linear Style) */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary/5 to-transparent -skew-x-12 translate-x-1/4 -z-10 hidden lg:block" />
      <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-accent/5 rounded-full blur-[80px] -z-10" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-32 items-center">
          {/* --- SISI KIRI: BRAND IDENTITY (Optimized for Mobile) --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-5 relative order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center">
              {/* Refined Frames - Hidden on small mobile to reduce clutter */}
              <div className="absolute inset-0 border border-slate-200 rounded-[2rem] lg:rounded-[bento] rotate-3 -z-10 hidden sm:block" />

              {/* The Main Card (Premium Glassmorphism) */}
              <div className="relative z-10 w-full h-full bg-white rounded-[2rem] lg:rounded-[bento] shadow-premium border border-slate-100 flex flex-col items-center justify-center p-10 lg:p-16 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-3/4 lg:w-full relative z-10"
                >
                  <img
                    src={logoDark}
                    alt="Logo OmzetNaik.id"
                    className="w-full h-auto object-contain drop-shadow-sm"
                  />
                </motion.div>

                <div className="mt-8 lg:mt-12 flex flex-col items-center space-y-4 lg:space-y-5 relative z-10">
                  <div className="h-1 w-10 lg:w-12 bg-accent rounded-full" />
                  <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] lg:tracking-[0.4em] text-center">
                    Strategic Digital Partner
                  </p>
                </div>
              </div>

              {/* Floating Performance Badge (SaaS Style) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 bg-primary text-white p-5 lg:p-7 rounded-[1.5rem] lg:rounded-[2rem] shadow-premium-hover z-20 border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 lg:gap-5">
                  <div className="p-2 lg:p-3 bg-accent rounded-lg lg:rounded-xl shadow-accent-glow">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <div className="pr-2 lg:pr-4">
                    <p className="text-lg lg:text-xl font-bold leading-none tracking-tight">
                      Scaling
                    </p>
                    <p className="text-[8px] lg:text-[9px] font-medium uppercase tracking-[0.15em] lg:tracking-[0.2em] mt-1 lg:mt-1.5 text-slate-400">
                      Revenue Growth
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* --- SISI KANAN: BRAND STORY --- */}
          <div className="lg:col-span-7 space-y-8 lg:order-2">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                <Sparkles size={14} /> Tentang OmzetNaik.id
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0, 0, 1] }}
                className="text-4xl lg:text-[5rem] font-bold text-primary leading-[1.1] lg:leading-[1] tracking-tighter"
              >
                Dedikasi Untuk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                  Konversi Bisnis.
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl space-y-6 lg:space-y-8"
              >
                <p className="text-slate-900 text-lg lg:text-2xl leading-relaxed font-medium tracking-tight">
                  Di era digital yang bergerak cepat, visibilitas saja tidak
                  cukup; bisnis Anda membutuhkan konversi.
                </p>

                <div className="space-y-4 lg:space-y-6 text-slate-500 text-base lg:text-lg leading-relaxed">
                  <p>
                    <span className="text-primary font-bold">OmzetNaik.id</span>{" "}
                    lahir sebagai agency kreatif dan strategis yang berdedikasi
                    untuk satu tujuan utama: memastikan kurva pendapatan bisnis
                    Anda terus menanjak.
                  </p>
                  <p>
                    Kami menggabungkan kekuatan data, digital advertising
                    (seperti Meta & Google Ads), dan branding visual yang tajam
                    untuk menciptakan kampanye promosi yang tepat sasaran.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
