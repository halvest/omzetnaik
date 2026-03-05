// src/components/About.tsx
import React from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";
import logoDark from "../assets/images/main_logo_dark.png";

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-[#F8FAFC] overflow-hidden py-24 lg:py-36 font-sans"
    >
      <h2 className="sr-only">
        Tentang OmzetNaik.id - Digital Agency Kreatif & Strategis
      </h2>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0F1F4A]/[0.015] -skew-x-12 translate-x-1/4 -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF3B3B]/[0.02] rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* --- SISI KIRI: BRAND IDENTITY (Logo Diperbesar) --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              {/* Decorative Frames */}
              <div className="absolute inset-0 border-2 border-[#0F1F4A]/5 rounded-[4.5rem] rotate-6" />
              <div className="absolute inset-4 border border-[#FF3B3B]/10 rounded-[4rem] -rotate-3" />

              {/* The Main Card with Larger Logo */}
              <div className="relative z-10 w-full h-full bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,31,74,0.12)] border border-slate-50 flex flex-col items-center justify-center p-8 lg:p-10">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex justify-center"
                >
                  {/* Logo diperbesar dengan w-4/5 agar mengisi ruang card */}
                  <img
                    src={logoDark}
                    alt="Logo OmzetNaik.id"
                    className="w-4/5 h-auto object-contain"
                  />
                </motion.div>

                <div className="mt-10 flex flex-col items-center space-y-4">
                  <div className="h-1.5 w-16 bg-[#FF3B3B] rounded-full" />
                  <p className="text-[11px] font-black text-[#0F1F4A] uppercase tracking-[0.5em] text-center">
                    Strategic Digital Partner
                  </p>
                </div>
              </div>

              {/* Floating Performance Badge */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 bg-[#0F1F4A] text-white p-6 rounded-[2.5rem] shadow-2xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#FF3B3B] rounded-2xl">
                    <TrendingUp size={24} />
                  </div>
                  <div className="pr-2">
                    <p className="text-2xl font-black leading-none uppercase">
                      Scaling
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-60">
                      Revenue Growth
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* --- SISI KANAN: BRAND STORY (Clean & Narrative) --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF3B3B]/5 border border-[#FF3B3B]/10 text-[#FF3B3B] rounded-2xl text-[10px] font-black uppercase tracking-[0.25em]"
              >
                <Sparkles size={14} /> Tentang OmzetNaik.id
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-[4.5rem] font-black text-[#0F1F4A] leading-[1] tracking-tighter"
              >
                Dedikasi Untuk <br />
                <span className="text-[#FF3B3B] italic underline decoration-[#FF3B3B]/10 underline-offset-[12px]">
                  Konversi Bisnis.
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl space-y-8"
              >
                <p className="text-slate-600 text-xl lg:text-2xl leading-relaxed font-semibold">
                  Di era digital yang bergerak cepat, visibilitas saja tidak
                  cukup; bisnis Anda membutuhkan konversi.
                </p>

                <div className="space-y-6 text-slate-500 text-lg leading-relaxed">
                  <p>
                    <span className="text-[#0F1F4A] font-bold">
                      OmzetNaik.id
                    </span>{" "}
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

            {/* Link Action */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <button className="group flex items-center gap-3 text-[#0F1F4A] font-black text-xs uppercase tracking-[0.3em] hover:text-[#FF3B3B] transition-colors">
                Selengkapnya Tentang Kami{" "}
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
