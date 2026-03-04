// src/components/DigitalServices.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Loader2,
} from "lucide-react";
import { supabase } from "../utils/supabase";
import { motion } from "framer-motion";

export default function DigitalServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedServices();
  }, []);

  return (
    <section id="services" className="py-12 md:py-24 bg-[#F8FAFC]/50 font-sans">
      <div className="container mx-auto px-5 lg:px-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B3B]/5 border border-[#FF3B3B]/10 rounded-full mb-4"
            >
              <Sparkles size={12} className="text-[#FF3B3B]" />
              <span className="text-[9px] font-black text-[#0F1F4A] uppercase tracking-widest">
                Agency Solutions
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F1F4A] leading-tight tracking-tighter">
              Layanan Kami <br className="hidden md:block" />
              <span className="text-[#FF3B3B] italic">Tepat & Terukur.</span>
            </h2>
          </div>

          <Link
            to="/services"
            className="group hidden md:inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#0F1F4A] hover:text-[#FF3B3B] transition-all"
          >
            Lihat Semua Jasa
            <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:bg-[#0F1F4A] group-hover:text-white transition-all shadow-sm">
              <ChevronRight size={16} />
            </div>
          </Link>
        </div>

        {/* --- SERVICES GRID --- */}
        {/* Menggunakan grid standar, bukan horizontal scroll yang bikin jumbo di mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-[4/5] bg-white rounded-[2rem] animate-pulse border border-slate-100"
                />
              ))
            : services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-[#0F1F4A]/5 transition-all duration-500 group flex flex-col h-full"
                >
                  {/* Media Section - Aspect Ratio diatur agar tidak terlalu tinggi */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={
                        service.image_url ||
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                      }
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={service.title}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[#0F1F4A] text-[8px] font-black rounded-lg uppercase tracking-widest shadow-sm border border-slate-100">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Content - Padding dirampingkan */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-heading font-black text-[#0F1F4A] mb-2 group-hover:text-[#FF3B3B] transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Benefits - Spasi lebih rapat */}
                    <div className="space-y-2.5 mb-8 flex-grow">
                      {service.benefit_list
                        ?.slice(0, 3)
                        .map((benefit: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 text-[11px] md:text-xs font-bold text-slate-600"
                          >
                            <div className="w-4 h-4 rounded-full bg-[#FF3B3B]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2
                                size={10}
                                className="text-[#FF3B3B]"
                              />
                            </div>
                            <span className="leading-snug truncate">
                              {benefit}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Footer - Lebih Compact */}
                    <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          Mulai Investasi
                        </span>
                        <span className="text-lg font-black text-[#0F1F4A]">
                          Rp {service.price_start?.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <Link
                        to={`/services/${service.slug}`}
                        className="w-11 h-11 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#0F1F4A] group-hover:bg-[#0F1F4A] group-hover:text-white transition-all shadow-sm"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* --- MOBILE FOOTER CTA --- */}
        <div className="mt-10 md:hidden">
          <Link
            to="/services"
            className="w-full py-4 bg-[#0F1F4A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            Lihat Semua Layanan <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
