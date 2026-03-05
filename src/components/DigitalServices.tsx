// src/components/DigitalServices.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Target,
  Megaphone,
  Fingerprint,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: "01",
    title: "Digital Marketing & Strategy",
    icon: <Target className="text-[#FF3B3B]" size={24} />,
    desc: "Riset pasar menyeluruh dan perencanaan kampanye jangka panjang yang disesuaikan dengan target sales Anda.",
  },
  {
    id: "02",
    title: "Digital Advertising",
    icon: <Megaphone className="text-blue-500" size={24} />,
    desc: "Mengelola iklan Meta, Google, dan TikTok dengan targeting presisi tinggi untuk ROI yang maksimal.",
  },
  {
    id: "03",
    title: "Branding & Identity",
    icon: <Fingerprint className="text-amber-500" size={24} />,
    desc: "Membangun karakter brand yang kuat agar selalu diingat, mulai dari positioning hingga panduan visual.",
  },
  {
    id: "04",
    title: "Promotion & Campaign",
    icon: <Zap className="text-pink-500" size={24} />,
    desc: "Eksekusi taktik promosi kreatif dan kolaborasi influencer untuk mendorong lonjakan transaksi.",
  },
];

export default function DigitalServices() {
  return (
    <section
      id="services"
      className="relative py-12 lg:py-24 bg-white overflow-hidden"
    >
      <div className="container relative z-10 px-4 md:px-6">
        {/* --- COMPACT HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 lg:mb-14 gap-4">
          <div className="max-w-4xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8FAFC] border border-slate-200 shadow-soft-premium rounded-full mb-3"
            >
              <Sparkles size={12} className="text-[#FF3B3B]" />
              <span className="text-[8px] font-black text-[#0F1F4A] uppercase tracking-[0.2em]">
                Our Services
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F1F4A] leading-tight tracking-tighter">
              Solusi Digital{" "}
              <span className="text-[#FF3B3B] italic">End-to-End.</span>
            </h2>
          </div>

          <Link
            to="/services"
            className="group hidden lg:inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#0F1F4A] hover:text-[#FF3B3B] transition-all"
          >
            Lihat Detail Layanan
            <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:bg-[#0F1F4A] group-hover:text-white transition-all shadow-sm">
              <ChevronRight size={18} />
            </div>
          </Link>
        </div>

        {/* --- SERVICES GRID: 4 Columns --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-[2.5rem] p-7 md:p-8 border border-slate-100 shadow-soft-premium hover:shadow-hover-premium hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Header Card: Icon & Number */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center border border-slate-50 group-hover:bg-white group-hover:shadow-md transition-all">
                    {service.icon}
                  </div>
                  <span className="text-[20px] font-black text-slate-100 group-hover:text-[#FF3B3B]/10 transition-colors">
                    {service.id}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#0F1F4A] mb-3 tracking-tight group-hover:text-[#FF3B3B] transition-colors leading-tight">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-[12px] leading-relaxed mb-8 flex-grow font-medium opacity-90">
                  {service.desc}
                </p>

                {/* Footer Action */}
                <div className="pt-5 border-t border-slate-100/50 flex items-center justify-between">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#FF3B3B] transition-colors">
                    Learn More
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#0F1F4A] group-hover:bg-[#0F1F4A] group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- MOBILE FOOTER --- */}
        <div className="mt-10 lg:hidden">
          <Link
            to="/services"
            className="w-full py-4 bg-[#0F1F4A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl"
          >
            Jelajahi Semua Layanan <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
