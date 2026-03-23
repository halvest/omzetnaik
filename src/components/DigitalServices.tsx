import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Megaphone,
  Fingerprint,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const services = [
  {
    id: "01",
    title: "Marketing Strategy",
    icon: <Target size={22} />,
    desc: "Riset pasar & rencana sales jangka panjang.",
    color: "bg-orange-50",
    iconColor: "text-orange-600",
    span: "lg:col-span-2",
  },
  {
    id: "02",
    title: "Digital Ads",
    icon: <Megaphone size={22} />,
    desc: "Meta, Google, & TikTok Ads presisi.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    span: "lg:col-span-1",
  },
  {
    id: "03",
    title: "Branding",
    icon: <Fingerprint size={22} />,
    desc: "Membangun identitas brand yang kuat.",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    span: "lg:col-span-1",
  },
  {
    id: "04",
    title: "Promotion",
    icon: <Zap size={22} />,
    desc: "Taktik kreatif & influencer marketing.",
    color: "bg-pink-50",
    iconColor: "text-pink-600",
    span: "lg:col-span-2",
  },
];

export default function DigitalServices() {
  return (
    <section className="relative min-h-screen lg:h-screen flex items-center bg-[#F8FAFC] overflow-hidden py-12 lg:py-0 lg:max-h-[900px]">
      <div className="container px-6 mx-auto">
        {/* Header - Ringkas & Responsive */}
        <div className="mb-8 lg:mb-12 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm"
          >
            <Sparkles size={14} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
              Our Services
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Solusi Digital <br className="lg:hidden" />
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic">
                End-to-End.
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 -z-10 rounded-full" />
            </span>
          </h2>
        </div>

        {/* Bento Grid - Mobile & Desktop Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative p-6 lg:p-8 rounded-[2rem] border border-slate-200 bg-white hover:shadow-xl transition-all duration-500 ${s.span}`}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6 lg:mb-8">
                  <div
                    className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl ${s.color} ${s.iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-3xl lg:text-4xl font-black text-slate-100 group-hover:text-slate-200/50 transition-colors">
                    {s.id}
                  </span>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                  {s.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                  {s.desc}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-accent transition-all">
                  Details
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
