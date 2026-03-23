import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TrendingUp, Sparkles, Target, Zap } from "lucide-react";
import logoDark from "../assets/images/main_logo_dark.png";

const About = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section
      id="about"
      className="relative bg-[#F8FAFC] overflow-hidden min-h-screen lg:h-screen flex items-center py-12 lg:py-0 font-sans"
    >
      <h2 className="sr-only">
        OmzetNaik.id - Agency Kreatif & Strategis Konversi Bisnis
      </h2>

      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-accent/5 to-transparent skew-x-12 translate-x-1/4 -z-10" />

      <div className="container relative px-6 mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center">
          {/* --- SISI KIRI: BRAND VISUAL (Optimasi Logo Persegi Padat) --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center items-center"
          >
            <div className="relative group w-full max-w-[280px] lg:max-w-[320px]">
              {/* Card Container Persegi Padat */}
              <div className="relative z-10 w-full aspect-square bg-white rounded-[2rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center p-8 overflow-hidden transition-transform duration-700 group-hover:scale-[1.01]">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* CONTAINER LOGO - Dibatasi ketat agar persegi tidak luas */}
                <motion.div
                  style={{ y: y1 }}
                  className="w-full relative z-10 flex justify-center items-center"
                >
                  <img
                    src={logoDark}
                    alt="Logo OmzetNaik.id"
                    // max-h dikunci agar persegi tidak meluas vertikal
                    className="h-auto max-h-[80px] lg:max-h-[100px] w-auto max-w-[90%] object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>

                <div className="mt-6 flex flex-col items-center gap-2 relative z-10">
                  <div className="h-1 w-8 bg-gradient-to-r from-accent to-orange-400 rounded-full" />
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    Growth Partner
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                style={{ y: y2 }}
                className="absolute -top-4 -right-4 lg:-top-5 lg:-right-5 bg-slate-900 text-white p-3.5 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl z-20 border border-white/10 backdrop-blur-xl group-hover:rotate-2 transition-transform duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-accent rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <TrendingUp size={18} className="text-white lg:hidden" />
                    <TrendingUp
                      size={20}
                      className="text-white hidden lg:block"
                    />
                  </div>
                  <div>
                    <p className="text-base font-black leading-none">Scaling</p>
                    <p className="text-[7px] font-bold uppercase tracking-widest mt-1 text-slate-400">
                      Revenue Expert
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* --- SISI KANAN: BRAND STORY (Layout Teks Dimaksimalkan) --- */}
          <div className="lg:col-span-7 space-y-6 lg:order-2">
            <div className="space-y-4 lg:space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-slate-200 shadow-sm rounded-full text-primary"
              >
                <Sparkles size={13} className="text-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  About Us
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // text-6xl dan leading-tight agar padat
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight"
              >
                Dedikasi Untuk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-red-500 to-orange-500">
                  Konversi Bisnis.
                  <div className="absolute -bottom-1 left-0 w-full h-3 bg-accent/10 -rotate-1 -z-10 rounded-full" />
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl space-y-5"
              >
                {/* Teks Sub-heading lebih rapat */}
                <p className="text-slate-800 text-lg md:text-xl lg:text-2xl font-semibold leading-snug tracking-tight">
                  Di era digital yang bergerak cepat, visibilitas saja tidak
                  cukup;{" "}
                  <span className="text-accent border-b border-accent/20">
                    bisnis Anda membutuhkan konversi.
                  </span>
                </p>

                {/* Blok Copywriting Utama - Rapat dan padat */}
                <div className="grid gap-4 text-slate-600 text-sm lg:text-[15px] leading-relaxed">
                  <div className="flex gap-4 p-4 bg-white/50 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white mt-0.5">
                      <Zap size={16} />
                    </div>
                    <p>
                      <span className="text-slate-900 font-bold">
                        OmzetNaik.id
                      </span>{" "}
                      lahir sebagai agency kreatif dan strategis yang
                      berdedikasi untuk satu tujuan utama:
                      <span className="text-slate-900 font-semibold">
                        {" "}
                        memastikan kurva pendapatan bisnis Anda terus menanjak.
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-4 p-4 bg-white/50 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white mt-0.5">
                      <Target size={16} />
                    </div>
                    <p>
                      Kami menggabungkan kekuatan data,{" "}
                      <span className="text-slate-900 font-medium italic">
                        digital advertising
                      </span>{" "}
                      (seperti Meta & Google Ads), dan branding visual yang
                      tajam untuk menciptakan kampanye promosi yang tepat
                      sasaran.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Footer - Spacing rapat */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="pt-4 border-t border-slate-200 flex gap-10"
            >
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900 leading-none">
                  100%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                  Data Driven
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900 leading-none">
                  ROI
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                  Focused Campaign
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
