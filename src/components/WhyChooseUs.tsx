// src/components/WhyChooseUs.tsx
import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Users,
} from "lucide-react";

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: <Target className="text-accent" size={24} />,
      title: "Strategi Tepat Sasaran",
      desc: "Kami tidak sekadar beriklan. Kami melakukan riset audiens mendalam untuk memastikan budget Anda menyasar hot-prospect.",
    },
    {
      icon: <BarChart3 className="text-accent" size={24} />,
      title: "Optimasi Berbasis Data",
      desc: "Keputusan campaign diambil berdasarkan angka (CTR, ROAS, CPC), bukan asumsi. Kami melakukan A/B testing berkelanjutan.",
    },
    {
      icon: <Zap className="text-accent" size={24} />,
      title: "Konversi Cepat",
      desc: "Fokus utama kami adalah 'Omzet Naik'. Setiap funnel dirancang untuk memperpendek jarak antara traffic dan closing.",
    },
    {
      icon: <ShieldCheck className="text-accent" size={24} />,
      title: "Transparansi Penuh",
      desc: "Anda mendapatkan akses laporan real-time tanpa ada biaya tersembunyi. Kepercayaan adalah pondasi kerja sama kami.",
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Side: Illustration & Stats */}
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-neutral-soft p-8 rounded-[2rem] border border-border hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-white rounded-2xl w-fit shadow-sm mb-4">
                  <TrendingUp className="text-secondary" />
                </div>
                <h4 className="text-3xl font-heading font-extrabold text-primary mb-1">
                  98%
                </h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  ROI Growth
                </p>
              </div>

              <div className="bg-primary p-8 rounded-[2rem] text-white hover:shadow-xl transition-all duration-300 lg:translate-y-8">
                <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">
                  <Users className="text-accent" />
                </div>
                <h4 className="text-3xl font-heading font-extrabold mb-1">
                  50+
                </h4>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                  Happy Clients
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all duration-300">
                <h4 className="text-2xl font-heading font-extrabold text-primary mb-2 italic">
                  Proven Result.
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Bukan sekadar janji, tapi bukti nyata peningkatan omzet
                  melalui digital funnel.
                </p>
              </div>

              <div className="bg-neutral-soft p-8 rounded-[2rem] border border-border hover:shadow-xl transition-all duration-300 lg:translate-y-8">
                <div className="flex -space-x-2 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-accent flex items-center justify-center text-[10px] text-white font-bold">
                    +12
                  </div>
                </div>
                <p className="text-xs font-bold text-primary uppercase">
                  Expert Team
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <ShieldCheck size={14} className="text-accent" /> Kenapa Memilih
              Kami
            </div>

            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-primary leading-tight mb-8">
              Partner Pertumbuhan Bisnis{" "}
              <span className="text-accent italic">Terpercaya.</span>
            </h2>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-5 group">
                  <div className="shrink-0 w-12 h-12 bg-neutral-soft rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    {React.cloneElement(benefit.icon as React.ReactElement, {
                      className: "group-hover:text-white transition-colors",
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
