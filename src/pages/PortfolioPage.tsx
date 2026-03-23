import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  TrendingUp,
  Loader2,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
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
  const [portfolios, setPortfolios] = useState([]);
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
    <main className="bg-[#F8FAFC] min-h-screen pt-32 pb-24 font-sans overflow-hidden">
      <Helmet>
        <title>Portfolio & Case Studies | OmzetNaik.id</title>
        <meta
          name="description"
          content="Kumpulan hasil kerja nyata OmzetNaik.id dalam mengakselerasi bisnis klien melalui strategi digital marketing."
        />
      </Helmet>

      {/* --- PREMIUM HERO HEADER --- */}
      <section className="container relative z-10 mb-12 lg:mb-16 text-center px-6 mx-auto">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full mb-6"
        >
          <Sparkles size={12} className="text-accent" />
          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
            Success Stories
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tighter leading-[1.1]"
        >
          Karya Nyata, <br className="hidden md:block" />
          <span className="relative inline-block pr-8 -mr-8 py-1">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic font-bold">
              Hasil Terukur.
            </span>
            <div className="absolute -bottom-1 left-0 right-8 h-2 bg-accent/10 -z-10 rounded-full" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-sm lg:text-base font-medium max-w-xl mx-auto leading-relaxed"
        >
          Kami tidak hanya bicara teori. Lihat bagaimana data dan strategi kami
          bertransformasi menjadi pertumbuhan omzet nyata bagi para partner
          kami.
        </motion.p>
      </section>

      {/* --- INTERACTIVE FILTER TABS --- */}
      <section className="container mb-12 lg:mb-16 px-6 mx-auto">
        <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 lg:px-5 lg:py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                  : "bg-white text-slate-400 border-slate-200 hover:border-accent hover:text-accent shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- PORTFOLIO GRID (COMPACT STYLE) --- */}
      <section className="container min-h-[300px] px-6 mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="animate-spin text-accent mb-4" size={32} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Syncing Data...
              </p>
            </motion.div>
          ) : portfolios.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
            >
              {portfolios.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.id}`}
                  className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col relative"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={
                        project.image_url ||
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-[8px] font-black rounded-full uppercase tracking-widest shadow-sm border border-white/20">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 flex-grow flex flex-col">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-auto p-1 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-all">
                      <div className="text-center py-3">
                        <p className="text-[7px] text-slate-400 uppercase font-black mb-0.5">
                          Impact
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-slate-900 truncate px-1">
                          {project.metric_1_val}
                        </p>
                      </div>
                      <div className="text-center py-3 border-x border-slate-200">
                        <p className="text-[7px] text-slate-400 uppercase font-black mb-0.5">
                          Growth
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-emerald-500 truncate px-1">
                          {project.metric_2_val}
                        </p>
                      </div>
                      <div className="text-center py-3">
                        <p className="text-[7px] text-slate-400 uppercase font-black mb-0.5">
                          Reach
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-accent truncate px-1">
                          {project.metric_3_val}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 max-w-2xl mx-auto">
              <LayoutGrid
                className="mx-auto text-slate-200 mb-4"
                size={40}
                strokeWidth={1.5}
              />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                No projects found in this category.
              </p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* --- CTA SECTION (OPTIMIZED SIZE) --- */}
      <section className="container mt-20 lg:mt-24 px-6 mx-auto">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-16 text-center relative overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tighter leading-tight">
              Siap Menjadi Kisah Sukses <br className="hidden md:block" />
              <span className="text-accent italic underline decoration-accent/20 underline-offset-8">
                Berikutnya?
              </span>
            </h2>
            <p className="text-slate-400 text-sm lg:text-base mb-10 max-w-lg mx-auto font-medium leading-relaxed">
              Konsultasikan kebutuhan marketing Anda dan dapatkan analisis
              strategi khusus untuk pertumbuhan brand Anda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/628123456789"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-accent text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-accent/20"
              >
                Konsultasi Gratis <ArrowRight size={16} />
              </a>
              <Link
                to="/services"
                className="px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/20 text-white hover:bg-white/5 transition-all"
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
