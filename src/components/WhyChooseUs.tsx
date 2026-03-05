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
    icon: <TrendingUp size={20} />,
    title: "Berorientasi pada Hasil",
    desc: "Nama kami adalah janji kami. Fokus utama metrik kami adalah pertumbuhan omzet Anda secara riil.",
    tag: "ROI Focused",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Strategi Berbasis Data",
    desc: "Setiap keputusan kampanye diambil berdasarkan analisis data yang akurat, bukan sekadar tebakan atau asumsi.",
    tag: "Data Driven",
  },
  {
    icon: <Layers size={20} />,
    title: "Spesialisasi Niche",
    desc: "Kami memahami luar-dalam cara memasarkan produk gaya hidup, kecantikan, properti, dan pariwisata.",
    tag: "Market Expert",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="relative py-16 lg:py-28 bg-white overflow-hidden"
    >
      {/* Decorative Blur - Emphasizing "Focus" */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3B3B]/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* --- SISI KIRI: THE PROMISE (Design Thinking: Empathy) --- 
              Menampilkan 'Expertise' dalam bentuk yang lebih elegan dan tidak 'ngotak'.
          */}
          <div className="lg:w-1/2 w-full relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8FAFC] border border-slate-200 shadow-soft-premium rounded-full mb-6">
                <Sparkles size={12} className="text-[#FF3B3B]" />
                <span className="text-[8px] font-black text-[#0F1F4A] uppercase tracking-[0.2em]">
                  Our Commitment
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0F1F4A] leading-[1] tracking-tighter mb-8">
                Kami Tidak <br /> Sekadar{" "}
                <span className="text-[#FF3B3B] italic underline decoration-[#FF3B3B]/10 underline-offset-8">
                  Berjanji.
                </span>
              </h2>

              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-lg mb-10">
                OmzetNaik.id dirancang untuk bisnis yang siap naik kelas dengan
                strategi yang terukur secara matematis.
              </p>

              {/* Trust Badge - Compact */}
              <div className="flex items-center gap-4 p-6 bg-[#F8FAFC] rounded-3xl border border-slate-100 w-fit shadow-soft-premium">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="text-[#FF3B3B]" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#0F1F4A] uppercase tracking-widest">
                    Client Priority
                  </p>
                  <p className="text-sm text-slate-500 font-bold">
                    100% Transparency Report
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- SISI KANAN: THE PILLARS (Design Thinking: Clarity) --- */}
          <div className="lg:w-1/2 w-full">
            <div className="grid gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft-premium hover:shadow-hover-premium hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon Container */}
                    <div className="shrink-0 w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center group-hover:bg-[#0F1F4A] group-hover:text-white transition-all duration-500">
                      {benefit.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-black text-[#0F1F4A] group-hover:text-[#FF3B3B] transition-colors">
                          {benefit.title}
                        </h4>
                        <span className="text-[7px] font-black px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md uppercase tracking-tighter">
                          {benefit.tag}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium opacity-90">
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
