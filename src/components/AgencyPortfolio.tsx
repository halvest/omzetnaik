// src/components/AgencyPortfolio.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Loader2,
  Sparkles,
  MoveRight,
} from "lucide-react";
import { supabase } from "../utils/supabase";
import { motion } from "framer-motion";

export default function AgencyPortfolio() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        setPortfolios(data || []);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  return (
    <section
      id="portfolio"
      className="relative py-12 lg:py-24 bg-white overflow-hidden font-sans"
    >
      <div className="container relative z-10">
        {/* --- COMPACT HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-14 gap-4">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8FAFC] border border-slate-200 shadow-soft-premium rounded-full mb-3"
            >
              <Briefcase size={12} className="text-[#FF3B3B]" />
              <span className="text-[8px] font-black text-[#0F1F4A] uppercase tracking-[0.2em]">
                Case Studies
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F1F4A] leading-[1] tracking-tighter">
              Kisah Sukses{" "}
              <span className="text-[#FF3B3B] italic">Partner Kami.</span>
            </h2>
          </div>

          <div className="flex lg:hidden items-center justify-center gap-2 text-slate-400 font-bold text-[8px] uppercase tracking-widest animate-pulse">
            Swipe <MoveRight size={12} />
          </div>

          <Link
            to="/portfolio"
            className="group hidden lg:inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#0F1F4A] hover:text-[#FF3B3B] transition-all"
          >
            Explore All
            <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:bg-[#0F1F4A] group-hover:text-white transition-all shadow-sm">
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        {/* --- PORTFOLIO GRID / SWIPE --- */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 px-4 -mx-4 lg:px-0 lg:mx-0 snap-x snap-mandatory no-scrollbar overflow-y-visible py-6">
          {loading ? (
            <div className="col-span-3 flex justify-center py-20 w-full">
              <Loader2 className="animate-spin text-[#FF3B3B]" size={32} />
            </div>
          ) : (
            portfolios.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[85vw] md:min-w-[380px] lg:min-w-0 snap-center group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-soft-premium hover:shadow-hover-premium hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Image Container - Aspect Ratio lebih padat */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F4A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      View Project <ExternalLink size={12} />
                    </span>
                  </div>
                </div>

                {/* Content - Padding lebih rapat */}
                <div className="p-7 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#0F1F4A] text-[8px] font-black rounded-lg uppercase tracking-widest border border-slate-100">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-black text-[#0F1F4A] text-xl mb-6 group-hover:text-[#FF3B3B] transition-colors leading-tight line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Impact Badge - Padat & Jelas */}
                  <div className="mt-auto p-4 bg-[#F8FAFC] rounded-2xl flex items-center gap-3 border border-slate-50 group-hover:bg-white transition-colors">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <TrendingUp size={16} className="text-[#FF3B3B]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
                        Results Achieved
                      </span>
                      <span className="text-sm font-black text-[#0F1F4A]">
                        {item.metric_1_val} {item.metric_1_label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deep Link Wrapper */}
                <Link
                  to={`/portfolio/${item.id}`}
                  className="absolute inset-0 z-20"
                />
              </motion.div>
            ))
          )}
        </div>

        {/* --- MOBILE CTA --- */}
        <div className="mt-8 lg:hidden">
          <Link
            to="/portfolio"
            className="w-full py-4 bg-[#0F1F4A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl"
          >
            Lihat Semua Portfolio <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
