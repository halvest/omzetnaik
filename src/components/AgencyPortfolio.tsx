import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Loader2,
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
          .limit(3);

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
      className="relative min-h-screen lg:h-screen flex items-center py-12 lg:py-0 bg-white overflow-hidden font-sans lg:max-h-[900px]"
    >
      <div className="container relative z-10 px-6 mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-12 gap-6">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full mb-4"
            >
              <Briefcase size={12} className="text-accent" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                Our Portfolio
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] tracking-tighter">
              Kisah Sukses <br className="hidden md:block" />
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic">
                  Partner Kami.
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 -z-10 rounded-full" />
              </span>
            </h2>
          </div>

          <Link
            to="/portfolio"
            className="group hidden lg:inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-all"
          >
            Explore All Projects
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* --- PORTFOLIO GRID (Limit 3 for 1 Screen Fit) --- */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-5 lg:gap-6 pb-8 lg:pb-0 snap-x snap-mandatory no-scrollbar">
          {loading ? (
            <div className="col-span-3 flex justify-center py-20 w-full">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            portfolios.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[80vw] md:min-w-[350px] lg:min-w-0 snap-center group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Image Area - Aspect ratio 16:11 optimized */}
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                      View Case Study{" "}
                      <ExternalLink size={12} className="text-accent" />
                    </span>
                  </div>
                </div>

                {/* Content Area - Compact Typography */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-accent text-[8px] font-black uppercase tracking-[0.2em] mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-primary text-xl lg:text-2xl mb-6 line-clamp-2 leading-tight tracking-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  {/* Impact Badge - Bento Mini Style */}
                  <div className="mt-auto p-4 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100 group-hover:bg-white group-hover:border-accent/10 transition-all duration-300">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <TrendingUp size={18} className="text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Impact
                      </span>
                      <span className="text-sm lg:text-base font-bold text-primary">
                        {item.metric_1_val} {item.metric_1_label}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/portfolio/${item.id}`}
                  className="absolute inset-0 z-20"
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Mobile Swipe Guide */}
        <div className="mt-6 flex md:hidden items-center justify-center gap-3 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
          Scroll for Projects <MoveRight size={12} className="animate-pulse" />
        </div>
      </div>
    </section>
  );
}
