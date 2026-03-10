// src/pages/PortfolioPage.tsx
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
    <main className="bg-slate-50 min-h-screen pt-32 pb-24 font-sans overflow-hidden">
      <Helmet>
        <title>Portfolio & Case Studies | OmzetNaik.id</title>
        <meta
          name="description"
          content="Kumpulan hasil kerja nyata OmzetNaik.id dalam mengakselerasi bisnis klien melalui strategi digital marketing."
        />
      </Helmet>

      {/* --- PREMIUM HERO HEADER --- */}
      <section className="container relative z-10 mb-20 text-center">
        {/* Background Accent */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full mb-8"
        >
          <Sparkles size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
            Success Stories
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-8 tracking-tighter leading-[1.05]"
        >
          Karya Nyata, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
            Hasil Terukur.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Kami tidak hanya bicara teori. Lihat bagaimana data dan strategi kami
          bertransformasi menjadi pertumbuhan omzet nyata bagi para partner
          kami.
        </motion.p>
      </section>

      {/* --- INTERACTIVE FILTER TABS (Silicon Valley Style) --- */}
      <section className="container mb-24">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary shadow-premium scale-105"
                  : "bg-white text-slate-400 border-slate-200 hover:border-primary hover:text-primary shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- PORTFOLIO GRID (Bento Polish) --- */}
      <section className="container min-h-[500px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <Loader2 className="animate-spin text-accent mb-6" size={48} />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                Menyelaraskan Data...
              </p>
            </motion.div>
          ) : portfolios.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14"
            >
              {portfolios.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.id}`}
                  className="group bg-white rounded-[bento] border border-slate-100 overflow-hidden hover:shadow-premium-hover transition-all duration-700 flex flex-col relative"
                >
                  {/* Image Preview with Hover Effect */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={
                        project.image_url ||
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-primary text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md border border-white/20">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Info Content Area */}
                  <div className="p-8 lg:p-12 flex-grow flex flex-col">
                    <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-5 leading-[1.2] group-hover:text-accent transition-colors duration-300 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-base lg:text-lg leading-relaxed mb-12 line-clamp-3 font-medium opacity-90">
                      {project.description}
                    </p>

                    {/* Key Metrics Dashboard (Mixed Theme) */}
                    <div className="grid grid-cols-3 gap-1 mt-auto p-1 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-all duration-500 group-hover:border-accent/10">
                      <div className="text-center py-6 px-2">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-2 tracking-[0.1em]">
                          Impact
                        </p>
                        <p className="text-base lg:text-xl font-bold text-primary tracking-tighter truncate">
                          {project.metric_1_val}
                        </p>
                      </div>
                      <div className="text-center py-6 px-2 border-x border-slate-200/60 bg-white/50 rounded-lg group-hover:bg-accent/5 transition-colors duration-500">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-2 tracking-[0.1em]">
                          Growth
                        </p>
                        <p className="text-base lg:text-xl font-bold text-emerald-500 tracking-tighter truncate">
                          {project.metric_2_val}
                        </p>
                      </div>
                      <div className="text-center py-6 px-2">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-2 tracking-[0.1em]">
                          Reach
                        </p>
                        <p className="text-base lg:text-xl font-bold text-accent tracking-tighter truncate">
                          {project.metric_3_val}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Corner Action Decor */}
                  <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-accent-glow">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[bento] border border-dashed border-slate-200">
              <LayoutGrid
                className="mx-auto text-slate-200 mb-6"
                size={64}
                strokeWidth={1}
              />
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                Belum ada project di kategori ini.
              </p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* --- HIGH-CONVERSION CTA SECTION --- */}
      <section className="container mt-40">
        <div className="bg-primary rounded-[bento] p-12 lg:p-28 text-center relative overflow-hidden shadow-premium">
          {/* Animated Background Decor */}
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold text-white mb-10 tracking-tighter leading-[1.1]">
              Siap Menjadi Kisah Sukses <br className="hidden md:block" />
              <span className="text-accent italic underline decoration-accent/20 underline-offset-[12px]">
                Berikutnya?
              </span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              Konsultasikan kebutuhan digital marketing Anda dan dapatkan
              analisis strategi pertumbuhan khusus untuk brand Anda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="https://wa.me/628123456789"
                className="btn-primary !px-12 !py-5 !text-sm shadow-accent-glow group"
              >
                Mulai Konsultasi Gratis
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
              <Link
                to="/services"
                className="px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.25em] border-2 border-white/10 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300"
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
