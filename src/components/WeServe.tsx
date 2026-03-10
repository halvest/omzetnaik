// src/components/WeServe.tsx
import React from "react";
import {
  ArrowRight,
  Sparkles,
  Building2,
  Plane,
  Shirt,
  Sparkle,
  MoveRight,
} from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  {
    id: 1,
    title: "Property",
    icon: Building2,
    color: "bg-red-50/30",
    borderColor: "border-red-100/50",
    iconColor: "text-accent",
    description: "Fokus pada hot leads berkualitas.",
    details: "Strategi peluncuran proyek dan villa komersial siap closing.",
  },
  {
    id: 2,
    title: "Hospitality",
    icon: Plane,
    color: "bg-blue-50/30",
    borderColor: "border-blue-100/50",
    iconColor: "text-blue-500",
    description: "Meningkatkan booking rate.",
    details: "Kampanye digital untuk penginapan dan layanan tour & travel.",
  },
  {
    id: 3,
    title: "Fashion",
    icon: Shirt,
    color: "bg-amber-50/30",
    borderColor: "border-amber-100/50",
    iconColor: "text-amber-500",
    description: "Identitas brand yang stylish.",
    details: "Mengubah followers menjadi pelanggan setia koleksi kolektif.",
  },
  {
    id: 4,
    title: "Beauty Care",
    icon: Sparkle,
    color: "bg-pink-50/30",
    borderColor: "border-pink-100/50",
    iconColor: "text-pink-500",
    description: "Estetika dan ulasan komunitas.",
    details: "Edukasi pasar untuk produk skincare dan klinik kecantikan.",
  },
];

export default function WeServe() {
  return (
    <section
      id="services"
      className="relative py-20 lg:py-32 bg-slate-50 overflow-hidden"
    >
      {/* Background Watermark - Refined Opacity */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[18vw] font-bold text-primary/[0.02] pointer-events-none select-none hidden lg:block uppercase whitespace-nowrap tracking-[0.2em]">
        Expertise
      </div>

      <div className="container relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-20 gap-6">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full mb-6"
            >
              <Sparkles size={14} className="text-accent" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Industries We Serve
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tighter">
              Formula Khusus{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                Tiap Lini Bisnis.
              </span>
            </h2>
          </div>

          {/* Mobile swipe guide - Refined Typography */}
          <div className="flex lg:hidden items-center justify-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Swipe to explore{" "}
            <MoveRight size={14} className="animate-bounce-x" />
          </div>
        </div>

        {/* --- CARDS GRID / SCROLL --- */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-12 lg:pb-0 snap-x snap-mandatory no-scrollbar mask-fade-edge-sm">
          {industries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.2, 0, 0, 1],
              }}
              className={`
                min-w-[85vw] sm:min-w-[320px] lg:min-w-0 snap-center 
                group relative rounded-[bento] p-8 border ${item.borderColor} 
                ${item.color} backdrop-blur-sm shadow-premium
                hover:bg-white hover:shadow-premium-hover hover:-translate-y-2
                transition-all duration-500 flex flex-col h-full overflow-hidden
              `}
            >
              {/* Subtle hover background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm border border-slate-100 ${item.iconColor} transition-transform group-hover:scale-110 duration-500`}
                >
                  <item.icon size={26} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-primary mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-primary text-[15px] font-semibold leading-snug mb-3">
                  {item.description}
                </p>
                <p className="text-slate-500 text-[14px] leading-relaxed mb-8 flex-grow font-medium">
                  {item.details}
                </p>

                {/* Footer Card */}
                <div className="pt-6 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                    Growth Strategy
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300`}
                  >
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
