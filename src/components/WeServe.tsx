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
    icon: <Building2 size={22} />,
    color: "rgba(255, 59, 59, 0.02)",
    borderColor: "border-red-200/40",
    iconColor: "text-[#FF3B3B]",
    description: "Fokus pada hot leads berkualitas.",
    details: "Strategi peluncuran proyek dan villa komersial siap closing.",
  },
  {
    id: 2,
    title: "Hospitality",
    icon: <Plane size={22} />,
    color: "rgba(59, 130, 246, 0.02)",
    borderColor: "border-blue-200/40",
    iconColor: "text-blue-500",
    description: "Meningkatkan booking rate.",
    details: "Kampanye digital untuk penginapan dan layanan tour & travel.",
  },
  {
    id: 3,
    title: "Fashion",
    icon: <Shirt size={22} />,
    color: "rgba(245, 158, 11, 0.02)",
    borderColor: "border-amber-200/40",
    iconColor: "text-amber-500",
    description: "Identitas brand yang stylish.",
    details: "Mengubah followers menjadi pelanggan setia koleksi kolektif.",
  },
  {
    id: 4,
    title: "Beauty Care",
    icon: <Sparkle size={22} />,
    color: "rgba(236, 72, 153, 0.02)",
    borderColor: "border-pink-200/40",
    iconColor: "text-pink-500",
    description: "Estetika dan ulasan komunitas.",
    details: "Edukasi pasar untuk produk skincare dan klinik kecantikan.",
  },
];

export default function WeServe() {
  return (
    <section
      id="services"
      className="relative py-10 lg:py-20 bg-[#F8FAFC] overflow-hidden min-h-fit"
    >
      {/* Watermark: Hidden on small mobile to avoid visual clutter */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-[15vw] font-black text-[#0F1F4A]/[0.03] pointer-events-none select-none hidden lg:block uppercase whitespace-nowrap tracking-widest">
        Expertise
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* --- OPTIMIZED HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-12 gap-3">
          <div className="max-w-4xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full mb-3"
            >
              <Sparkles size={10} className="text-[#FF3B3B]" />
              <span className="text-[7px] md:text-[8px] font-black text-[#0F1F4A] uppercase tracking-[0.2em]">
                Industries We Serve
              </span>
            </motion.div>

            {/* Responsively handle text wrapping: Wrap on small mobile, One-line on Desktop */}
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-[#0F1F4A] leading-tight tracking-tighter lg:whitespace-nowrap">
              Formula Khusus{" "}
              <span className="text-[#FF3B3B] italic">Tiap Lini Bisnis.</span>
            </h2>
          </div>

          {/* Mobile swipe guide - More subtle */}
          <div className="flex lg:hidden items-center justify-center gap-2 text-slate-300 font-black text-[7px] uppercase tracking-[0.3em]">
            Swipe Right <MoveRight size={10} />
          </div>
        </div>

        {/* --- MOBILE OPTIMIZED LIST --- 
            -mx-4 and px-4 allows the cards to scroll to the very edge of the screen 
        */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 md:gap-6 px-4 -mx-4 lg:px-0 lg:mx-0 snap-x snap-mandatory no-scrollbar overflow-y-visible py-4">
          {industries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{ backgroundColor: item.color }}
              className={`
                min-w-[75vw] sm:min-w-[300px] lg:min-w-0 snap-center 
                group relative rounded-[2rem] p-6 md:p-8 border ${item.borderColor} 
                backdrop-blur-sm shadow-soft-premium
                hover:bg-white hover:shadow-hover-premium hover:-translate-y-1
                transition-all duration-500 flex flex-col h-full
              `}
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Responsive Icon Size */}
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm border border-slate-50 ${item.iconColor}`}
                >
                  {React.cloneElement(item.icon as React.ReactElement, {
                    size: 20,
                  })}
                </div>

                <h3 className="text-xl md:text-2xl font-black text-[#0F1F4A] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[#0F1F4A] text-[13px] font-bold leading-snug mb-2">
                  {item.description}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed mb-6 flex-grow font-medium opacity-90">
                  {item.details}
                </p>

                <div className="pt-4 border-t border-slate-100/50 flex items-center justify-between">
                  <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest group-hover:text-[#FF3B3B] transition-colors">
                    Scaling
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-white border ${item.borderColor} flex items-center justify-center text-[#0F1F4A] group-hover:bg-[#0F1F4A] group-hover:text-white transition-all`}
                  >
                    <ArrowRight
                      size={14}
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
