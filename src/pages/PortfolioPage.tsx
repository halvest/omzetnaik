// src/pages/PortfolioPage.tsx
import React, { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, Loader2, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

const CATEGORIES = [
  "All",
  "Meta Ads",
  "Google Ads",
  "Web Development",
  "SEO",
  "Social Media",
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("portfolios")
          .select("*")
          .order("created_at", { ascending: false });

        if (activeCategory !== "All") {
          query = query.eq("category", activeCategory);
        }

        const { data, error } = await query;
        if (error) throw error;
        setPortfolios(data || []);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [activeCategory]);

  return (
    <main className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 font-sans">
      <Helmet>
        <title>Portfolio & Case Studies | OmzetNaik.id</title>
        <meta
          name="description"
          content="Kumpulan hasil kerja nyata OmzetNaik.id dalam mengakselerasi bisnis klien melalui strategi digital marketing."
        />
      </Helmet>

      {/* --- HERO HEADER --- */}
      <section className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-[#0F1F4A]/5 border border-[#0F1F4A]/10 px-4 py-2 rounded-full mb-6"
        >
          <TrendingUp size={16} className="text-[#FF3B3B]" />
          <span className="text-[10px] font-black text-[#0F1F4A] uppercase tracking-[0.2em]">
            Success Stories
          </span>
        </motion.div>
        <h1 className="text-4xl md:text-7xl font-heading font-extrabold text-[#0F1F4A] mb-6 tracking-tighter leading-tight">
          Karya Nyata,{" "}
          <span className="text-[#FF3B3B] italic">Hasil Terukur.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Kami tidak hanya bicara teori. Lihat bagaimana data dan strategi kami
          bertransformasi menjadi pertumbuhan omzet nyata bagi para partner
          kami.
        </p>
      </section>

      {/* --- FILTER TABS --- */}
      <section className="container mx-auto px-6 mb-16">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-[#0F1F4A] text-white border-[#0F1F4A] shadow-xl shadow-primary/20 scale-105"
                  : "bg-white text-slate-400 border-slate-100 hover:border-[#0F1F4A] hover:text-[#0F1F4A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- PORTFOLIO GRID --- */}
      <section className="container mx-auto px-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#FF3B3B] mb-4" size={40} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Menyaring Data...
              </p>
            </div>
          ) : portfolios.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
              {portfolios.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.id}`}
                  className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(15,31,74,0.15)] transition-all duration-500 group flex flex-col"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={
                        project.image_url ||
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-[#0F1F4A] text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-8 md:p-12 flex-grow flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-[#0F1F4A] mb-4 leading-tight group-hover:text-[#FF3B3B] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Key Metrics - Dynamic from DB */}
                    <div className="grid grid-cols-3 gap-2 mt-auto p-6 bg-[#F8FAFC] rounded-[2rem] border border-slate-50 group-hover:bg-white transition-colors group-hover:border-[#FF3B3B]/10">
                      <div className="text-center">
                        <p className="text-[8px] text-slate-400 uppercase font-black mb-1 tracking-tighter">
                          Impact
                        </p>
                        <p className="text-xs md:text-sm font-black text-[#0F1F4A] truncate">
                          {project.metric_1_val}
                        </p>
                      </div>
                      <div className="text-center border-x border-slate-100 px-1">
                        <p className="text-[8px] text-slate-400 uppercase font-black mb-1 tracking-tighter">
                          Growth
                        </p>
                        <p className="text-xs md:text-sm font-black text-emerald-500 truncate">
                          {project.metric_2_val}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-slate-400 uppercase font-black mb-1 tracking-tighter">
                          Reach
                        </p>
                        <p className="text-xs md:text-sm font-black text-[#FF3B3B] truncate">
                          {project.metric_3_val}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <LayoutGrid className="mx-auto text-slate-100 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Belum ada project di kategori ini.
              </p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="container mx-auto px-6 mt-32">
        <div className="bg-[#0F1F4A] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3B3B]/10 rounded-full blur-[100px] -mr-48 -mt-48" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-8 tracking-tighter leading-none">
              Siap Menjadi Kisah Sukses <br />
              <span className="text-[#FF3B3B]">Berikutnya?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
              Konsultasikan kebutuhan digital marketing Anda dan dapatkan
              analisis strategi pertumbuhan khusus untuk brand Anda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/628123456789"
                className="px-10 py-5 bg-[#FF3B3B] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-[#0F1F4A] transition-all flex items-center justify-center gap-3"
              >
                Mulai Konsultasi <ArrowRight size={16} />
              </a>
              <Link
                to="/services"
                className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-white/10 text-white hover:bg-white/5 transition-all"
              >
                Lihat Layanan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
