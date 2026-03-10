// src/components/WhyChooseUs.tsx
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
    icon: <TrendingUp size={24} />,
    title: "Berorientasi pada Hasil",
    desc: "Nama kami adalah janji kami. Fokus utama metrik kami adalah pertumbuhan omzet Anda secara riil.",
    tag: "ROI Focused",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Strategi Berbasis Data",
    desc: "Setiap keputusan kampanye diambil berdasarkan analisis data yang akurat, bukan sekadar tebakan atau asumsi.",
    tag: "Data Driven",
  },
  {
    icon: <Layers size={24} />,
    title: "Spesialisasi Niche",
    desc: "Kami memahami luar-dalam cara memasarkan produk gaya hidup, kecantikan, properti, dan pariwisata.",
    tag: "Market Expert",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="relative py-24 lg:py-40 bg-white overflow-hidden"
    >
      {/* Refined Decorative Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          {/* --- SISI KIRI: THE PROMISE --- */}
          <div className="lg:w-[45%] w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 border border-slate-200 shadow-sm rounded-full mb-8">
                <Sparkles size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
                  Our Commitment
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-bold text-primary leading-[1.05] tracking-tighter mb-10">
                Kami Tidak <br /> Sekadar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                  Berjanji.
                </span>
              </h2>

              <p className="text-slate-500 text-lg lg:text-xl font-medium leading-relaxed max-w-lg mb-12">
                OmzetNaik.id dirancang untuk bisnis yang siap naik kelas dengan
                strategi yang terukur secara matematis.
              </p>

              {/* Trust Badge - Modern Glassmorphism */}
              <div className="flex items-center gap-5 p-6 bg-slate-50/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 w-fit shadow-premium group hover:shadow-premium-hover transition-all duration-500">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1">
                    Client Priority
                  </p>
                  <p className="text-sm text-slate-600 font-bold">
                    100% Transparency Report
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- SISI KANAN: THE PILLARS (Clean Cards) --- */}
          <div className="lg:w-[55%] w-full">
            <div className="grid gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="group relative p-8 md:p-10 bg-white rounded-[bento] border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle hover background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                    {/* Icon Container - Vercel Style */}
                    <div className="shrink-0 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-primary group-hover:scale-110">
                      {benefit.icon}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors tracking-tight">
                          {benefit.title}
                        </h4>
                        <span className="text-[9px] font-bold px-3 py-1 bg-slate-100 text-slate-400 rounded-full uppercase tracking-widest group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                          {benefit.tag}
                        </span>
                      </div>
                      <p className="text-slate-500 text-base leading-relaxed font-medium">
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
