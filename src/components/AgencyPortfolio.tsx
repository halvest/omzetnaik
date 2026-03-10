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
      className="relative py-20 lg:py-32 bg-white overflow-hidden font-sans"
    >
      <div className="container relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-20 gap-8">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 shadow-sm rounded-full mb-6"
            >
              <Briefcase size={14} className="text-accent" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Case Studies
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tighter">
              Kisah Sukses <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                Partner Kami.
              </span>
            </h2>
          </div>

          <div className="flex lg:hidden items-center justify-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Swipe to view <MoveRight size={14} className="animate-bounce-x" />
          </div>

          <Link
            to="/portfolio"
            className="group hidden lg:inline-flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-all"
          >
            Explore All Projects
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        {/* --- PORTFOLIO GRID / HORIZONTAL SCROLL --- */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-8 pb-12 lg:pb-0 snap-x snap-mandatory no-scrollbar mask-fade-edge-sm">
          {loading ? (
            <div className="col-span-3 flex justify-center py-32 w-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Memuat Karya...
                </span>
              </div>
            </div>
          ) : (
            portfolios.map((item, index) => (
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
                className="min-w-[85vw] md:min-w-[400px] lg:min-w-0 snap-center group relative bg-white rounded-[bento] border border-slate-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Image Container (Sinematik 16:10) */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-110"
                  />

                  {/* Overlay Imersif */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        View Case Study{" "}
                        <ExternalLink size={14} className="text-accent" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 lg:p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-slate-50 text-primary text-[9px] font-bold rounded-full uppercase tracking-widest border border-slate-100">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-primary text-2xl lg:text-3xl mb-8 group-hover:text-accent transition-colors duration-300 leading-tight line-clamp-2 tracking-tight">
                    {item.title}
                  </h3>

                  {/* Impact/Result Badge (Bento Style) */}
                  <div className="mt-auto p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100 group-hover:bg-white group-hover:border-accent/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-accent-glow transition-all">
                      <TrendingUp size={20} className="text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Success Impact
                      </span>
                      <span className="text-lg font-bold text-primary tracking-tight">
                        {item.metric_1_val} {item.metric_1_label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invisible Link */}
                <Link
                  to={`/portfolio/${item.id}`}
                  className="absolute inset-0 z-20"
                />
              </motion.div>
            ))
          )}
        </div>

        {/* --- MOBILE CTA --- */}
        <div className="mt-12 lg:hidden px-4">
          <Link
            to="/portfolio"
            className="btn-primary w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-accent-glow"
          >
            Lihat Semua Portfolio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
