import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { supabase } from "../utils/supabase";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

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
      className="py-16 md:py-24 bg-white overflow-hidden font-sans"
    >
      <div className="container mx-auto px-5 md:px-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F1F4A]/5 border border-[#0F1F4A]/10 rounded-full mb-4"
            >
              <Briefcase size={14} className="text-[#FF3B3B]" />
              <span className="text-[10px] font-black text-[#0F1F4A] uppercase tracking-[0.2em]">
                Case Studies
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#0F1F4A] leading-tight tracking-tighter">
              Kisah Sukses <br />
              <span className="text-[#FF3B3B] italic">
                Partner Bisnis Kami.
              </span>
            </h2>
            <p className="mt-4 text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
              Lihat bagaimana strategi presisi kami membantu brand mencapai
              target pertumbuhan yang terukur dan inovatif.
            </p>
          </div>

          <Link
            to="/portfolio"
            className="hidden md:flex items-center gap-3 text-[#0F1F4A] font-black text-xs uppercase tracking-[0.2em] hover:text-[#FF3B3B] transition-all group"
          >
            Explore All Projects
            <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center group-hover:bg-[#0F1F4A] group-hover:text-white transition-all">
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        </div>

        {/* --- PORTFOLIO SLIDER --- */}
        <div className="mb-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#FF3B3B]" size={40} />
            </div>
          ) : (
            <Swiper
              modules={[FreeMode, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              freeMode={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3, freeMode: false },
              }}
              className="!overflow-visible"
            >
              {portfolios.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(15,31,74,0.15)] transition-all duration-500 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={
                          item.image_url ||
                          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F4A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <Link
                          to={`/portfolio/${item.id}`}
                          className="w-12 h-12 bg-[#FF3B3B] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/30"
                        >
                          <ExternalLink size={20} />
                        </Link>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex-grow flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#F8FAFC] text-[#0F1F4A] text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-50">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-heading font-extrabold text-[#0F1F4A] text-xl mb-4 group-hover:text-[#FF3B3B] transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Result Badge - Dynamic from DB Metrics */}
                      <div className="mt-auto p-4 bg-[#F8FAFC] rounded-2xl flex items-center gap-3 border border-slate-50 group-hover:bg-white group-hover:border-[#FF3B3B]/10 transition-colors">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                          <TrendingUp size={16} className="text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                            Impact
                          </span>
                          <span className="text-sm font-black text-[#0F1F4A]">
                            {item.metric_1_val} {item.metric_1_label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* --- MOBILE CTA --- */}
        <div className="md:hidden">
          <Link
            to="/portfolio"
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#0F1F4A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            Lihat Semua Portfolio <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet-active {
          background: #FF3B3B !important;
        }
      `}</style>
    </section>
  );
}
