import React from "react";
import {
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <TrendingUp size={20} />,
    title: "Berorientasi pada Hasil",
    desc: "Nama kami adalah janji kami. Fokus utama metrik kami adalah pertumbuhan omzet Anda.",
    tag: "ROI Focused",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Strategi Berbasis Data",
    desc: "Keputusan kampanye diambil berdasarkan analisis data yang akurat, bukan sekadar tebakan.",
    tag: "Data Driven",
  },
  {
    icon: <Layers size={20} />,
    title: "Spesialisasi Niche",
    desc: "Paham luar-dalam memasarkan produk gaya hidup, kecantikan, properti, dan pariwisata.",
    tag: "Market Expert",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="relative min-h-screen lg:h-screen flex items-center py-12 lg:py-0 bg-white overflow-hidden font-sans lg:max-h-[850px]"
    >
      {/* Background Decor */}
      <div className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] bg-accent/5 rounded-full blur-[90px] -z-10 animate-pulse" />

      <div className="container relative z-10 px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 xl:gap-20">
          {/* --- SISI KIRI: THE PROMISE --- */}
          <div className="lg:w-[45%] w-full text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 shadow-sm rounded-full mb-6">
                <Sparkles size={12} className="text-accent" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Why Choose Us?
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-[1.1] tracking-tighter mb-6 lg:mb-8">
                Kami Tidak <br className="hidden lg:block" /> Sekadar{" "}
                <span className="relative inline-block mt-1">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic">
                    Berjanji.
                  </span>
                  <div className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 -z-10 rounded-full" />
                </span>
              </h2>

              <p className="text-slate-500 text-base lg:text-lg font-medium leading-relaxed max-w-lg mb-8 mx-auto lg:mx-0">
                OmzetNaik.id dirancang untuk bisnis yang siap naik kelas dengan
                strategi yang terukur secara matematis.
              </p>

              {/* Trust Badge - Compact */}
              <div className="inline-flex items-center gap-4 p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-white group">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                    Client Priority
                  </p>
                  <p className="text-xs text-slate-600 font-bold">
                    100% Transparency Report
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- SISI KANAN: THE PILLARS (Clean & Compact) --- */}
          <div className="lg:w-[55%] w-full">
            <div className="grid gap-4 lg:gap-5">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-5 lg:p-6 bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10 flex items-start gap-4 lg:gap-6">
                    {/* Icon Container */}
                    <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-slate-100">
                      {benefit.icon}
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="text-lg lg:text-xl font-bold text-primary group-hover:text-accent transition-colors tracking-tight">
                          {benefit.title}
                        </h4>
                        <span className="text-[8px] font-bold px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full uppercase tracking-widest group-hover:bg-accent/10 group-hover:text-accent">
                          {benefit.tag}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
