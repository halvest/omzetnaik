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
    icon: <Target className="text-accent" size={28} />,
    desc: "Riset pasar menyeluruh dan perencanaan kampanye jangka panjang yang disesuaikan dengan target sales Anda.",
    className: "lg:col-span-2", // Bento effect: Card pertama lebih lebar
  },
  {
    id: "02",
    title: "Digital Advertising",
    icon: <Megaphone className="text-blue-500" size={28} />,
    desc: "Mengelola iklan Meta, Google, dan TikTok dengan targeting presisi tinggi untuk ROI yang maksimal.",
    className: "lg:col-span-1",
  },
  {
    id: "03",
    title: "Branding & Identity",
    icon: <Fingerprint className="text-amber-500" size={28} />,
    desc: "Membangun karakter brand yang kuat agar selalu diingat, mulai dari positioning hingga panduan visual.",
    className: "lg:col-span-1",
  },
  {
    id: "04",
    title: "Promotion & Campaign",
    icon: <Zap className="text-pink-500" size={28} />,
    desc: "Eksekusi taktik promosi kreatif dan kolaborasi influencer untuk mendorong lonjakan transaksi.",
    className: "lg:col-span-2", // Bento effect: Card terakhir lebih lebar
  },
];

export default function DigitalServices() {
  return (
    <section
      id="services"
      className="relative py-24 lg:py-36 bg-white overflow-hidden"
    >
      <div className="container relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 shadow-sm rounded-full mb-6"
            >
              <Sparkles size={14} className="text-accent" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Our Services
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tighter">
              Solusi Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                End-to-End.
              </span>
            </h2>
          </div>

          <Link
            to="/services"
            className="group hidden lg:inline-flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-all"
          >
            Lihat Detail Layanan
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
              <ChevronRight size={20} />
            </div>
          </Link>
        </div>

        {/* --- BENTO GRID SYSTEM --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.2, 0, 0, 1],
              }}
              className={`group relative bg-white rounded-[bento] p-8 md:p-10 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 flex flex-col h-full overflow-hidden ${service.className}`}
            >
              {/* Animated Background Glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-accent/5 transition-colors duration-700 -z-10" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Card Header: Icon & ID */}
                <div className="flex items-start justify-between mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-500">
                    {service.icon}
                  </div>
                  <span className="text-5xl font-bold text-slate-50 group-hover:text-accent/10 transition-colors duration-500">
                    {service.id}
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4 tracking-tight group-hover:text-accent transition-colors duration-300 leading-tight">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-base lg:text-lg leading-relaxed mb-10 flex-grow font-medium">
                  {service.desc}
                </p>

                {/* Footer Action */}
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                    Explore Service
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- MOBILE FOOTER --- */}
        <div className="mt-12 lg:hidden px-4">
          <Link
            to="/services"
            className="btn-primary flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] shadow-accent-glow"
          >
            Jelajahi Semua Layanan <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
