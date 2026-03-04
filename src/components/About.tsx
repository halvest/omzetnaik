// src/components/About.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Target,
  BarChart3,
  Globe,
  Trophy,
  Zap,
  TrendingUp,
} from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-neutral-soft overflow-hidden py-20 lg:py-32"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/[0.02] -skew-x-12 translate-x-1/4 -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* --- SISI KIRI: VISUAL & STATS --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl z-10 aspect-square border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="OmzetNaik Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-6 -right-6 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 border border-slate-100 hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-accent p-3 rounded-2xl text-white shadow-lg shadow-accent/30">
                  <Trophy size={28} />
                </div>
                <div>
                  <p className="text-3xl font-heading font-extrabold text-primary leading-none">
                    5.4x
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                    Avg. ROAS Result
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* --- SISI KANAN: CONTENT --- */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe size={14} className="text-accent" /> Tentang OmzetNaik.id
            </div>

            <h2 className="text-4xl lg:text-6xl font-heading font-extrabold text-primary leading-[1.1]">
              Partner Strategis <br />
              <span className="text-accent italic">Akselerasi</span> Bisnis.
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed font-sans">
              Kami lahir dari kebutuhan akan pemasaran digital yang **berbasis
              hasil**, bukan sekadar impresi. OmzetNaik.id hadir sebagai
              jembatan bagi pemilik bisnis untuk mendominasi pasar digital
              melalui strategi iklan yang presisi dan data-driven.
            </p>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-6 bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all group">
                <Target
                  className="text-accent mb-3 group-hover:scale-110 transition-transform"
                  size={24}
                />
                <h4 className="font-heading font-bold text-primary text-sm uppercase">
                  Growth Mindset
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Setiap campaign berfokus pada skalabilitas bisnis Anda secara
                  berkelanjutan.
                </p>
              </div>

              <div className="p-6 bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all group">
                <BarChart3
                  className="text-secondary mb-3 group-hover:scale-110 transition-transform"
                  size={24}
                />
                <h4 className="font-heading font-bold text-primary text-sm uppercase">
                  Data Driven
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Keputusan diambil berdasarkan angka riil dan riset audiens
                  mendalam.
                </p>
              </div>

              <div className="p-6 bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all group">
                <Zap
                  className="text-amber-500 mb-3 group-hover:scale-110 transition-transform"
                  size={24}
                />
                <h4 className="font-heading font-bold text-primary text-sm uppercase">
                  High Conversion
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mengoptimalkan landing page untuk konversi penjualan yang
                  lebih tinggi.
                </p>
              </div>

              <div className="p-6 bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all group">
                <TrendingUp
                  className="text-green-500 mb-3 group-hover:scale-110 transition-transform"
                  size={24}
                />
                <h4 className="font-heading font-bold text-primary text-sm uppercase">
                  ROI Oriented
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Memastikan setiap rupiah budget iklan Anda menghasilkan profit
                  maksimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
