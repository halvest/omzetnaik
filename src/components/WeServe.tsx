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
    color: "group-hover:bg-red-500",
    lightColor: "bg-red-50",
    iconColor: "text-red-600",
    description: "Fokus pada hot leads berkualitas.",
    details: "Strategi peluncuran proyek dan villa komersial siap closing.",
  },
  {
    id: 2,
    title: "Hospitality",
    icon: Plane,
    color: "group-hover:bg-blue-500",
    lightColor: "bg-blue-50",
    iconColor: "text-blue-600",
    description: "Meningkatkan booking rate.",
    details: "Kampanye digital untuk penginapan dan layanan tour & travel.",
  },
  {
    id: 3,
    title: "Fashion",
    icon: Shirt,
    color: "group-hover:bg-amber-500",
    lightColor: "bg-amber-50",
    iconColor: "text-amber-600",
    description: "Identitas brand yang stylish.",
    details: "Mengubah followers menjadi pelanggan setia koleksi kolektif.",
  },
  {
    id: 4,
    title: "Beauty Care",
    icon: Sparkle,
    color: "group-hover:bg-pink-500",
    lightColor: "bg-pink-50",
    iconColor: "text-pink-600",
    description: "Estetika dan ulasan komunitas.",
    details: "Edukasi pasar untuk produk skincare dan klinik kecantikan.",
  },
];

export default function WeServe() {
  return (
    <section
      id="services"
      className="relative min-h-screen lg:h-screen flex items-center py-16 lg:py-0 bg-[#F8FAFC] overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Watermark - Adjusted size for 1 screen fit */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[12vw] font-black text-slate-200/20 pointer-events-none select-none hidden lg:block uppercase tracking-tighter">
        Industries
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        {/* --- HEADER SECTION - Compacted --- */}
        <div className="max-w-4xl mb-10 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-[2px] w-10 bg-accent inline-block"></span>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
              Our Expertise
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight"
          >
            Formula Khusus <br />
            <span className="relative inline-block mt-1">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400">
                Tiada Lini Bisnis.
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 -z-10 rounded-full" />
            </span>
          </motion.h2>

          <p className="mt-4 text-base md:text-lg text-slate-500 max-w-xl font-medium leading-snug">
            Kami tidak menggunakan satu solusi untuk semua. Setiap industri
            memiliki DNA unik yang memerlukan pendekatan kreatif berbeda.
          </p>
        </div>

        {/* --- CARDS GRID - Compacted for Desktop --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {industries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-2"
            >
              {/* Vibrant Hover Background */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 ${item.color}`}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container - Scaled Down */}
                <div
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${item.lightColor} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}
                >
                  <item.icon
                    size={24}
                    className={`${item.iconColor} transition-colors duration-500`}
                    strokeWidth={2.5}
                  />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-slate-900 text-[13px] lg:text-sm font-bold leading-tight mb-2">
                  {item.description}
                </p>

                <p className="text-slate-500 text-[12px] lg:text-[13px] leading-relaxed mb-6 flex-grow font-medium">
                  {item.details}
                </p>

                {/* Footer Card - Compact */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Expertise
                  </span>
                  <div className="flex items-center gap-2 text-primary font-bold text-xs group-hover:text-accent transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Guide */}
        <div className="mt-8 flex md:hidden items-center justify-center gap-3 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
          Scroll to see more <MoveRight size={12} className="animate-pulse" />
        </div>
      </div>
    </section>
  );
}
