// src/pages/PortfolioDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  Target,
  Layers,
  Loader2,
  CheckCircle2,
  Share2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          toast.error("Project tidak ditemukan");
          navigate("/portfolio");
          return;
        }
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link project berhasil disalin!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-accent mb-4" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Menyelaraskan Case Study...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      <Helmet>
        <title>{project.title} | Case Study OmzetNaik.id</title>
        <meta name="description" content={project.description} />
        <meta property="og:image" content={project.image_url} />
      </Helmet>

      {/* --- STICKY TOP NAV (Premium Glassmorphism) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="container h-20 flex items-center justify-between">
          <Link
            to="/portfolio"
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:block">
              Kembali ke Portfolio
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-3 bg-slate-50 text-slate-400 hover:text-accent rounded-2xl border border-slate-100 transition-all active:scale-90"
            >
              <Share2 size={18} />
            </button>
            <a
              href={`https://wa.me/628123456789?text=Halo OmzetNaik, saya tertarik berdiskusi mengenai project ${project.title}`}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-slate-900 transition-all"
            >
              Mulai Konsultasi
            </a>
          </div>
        </div>
      </nav>

      <div className="container max-w-6xl pt-36">
        {/* --- PROJECT HEADER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent/5 border border-accent/10 text-accent text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
              <Sparkles size={14} /> Case Study: {project.category}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-[1.05] tracking-tighter">
              {project.title}
            </h1>

            <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium tracking-tight">
              {project.description}
            </p>

            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex !w-auto gap-3 items-center group"
              >
                Kunjungi Live Website
                <ExternalLink
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            )}
          </motion.div>

          {/* Featured Image with Bento Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[bento] translate-x-4 translate-y-4 -z-10 blur-xl"></div>
            <img
              src={
                project.image_url ||
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
              }
              className="w-full aspect-[4/5] lg:aspect-square object-cover rounded-[bento] shadow-premium border border-white"
              alt={project.title}
            />
          </motion.div>
        </div>

        {/* --- IMPACT METRICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: TrendingUp,
              val: project.metric_1_val || "150%",
              label: project.metric_1_label || "ROAS Increase",
              dark: true,
            },
            {
              icon: Target,
              val: project.metric_2_val || "12k+",
              label: project.metric_2_label || "New Leads",
              dark: false,
            },
            {
              icon: Layers,
              val: project.metric_3_val || "2.4M",
              label: project.metric_3_label || "Ad Impression",
              dark: false,
            },
          ].map((metric, i) => (
            <div
              key={i}
              className={`p-12 rounded-[bento] flex flex-col items-center text-center space-y-4 transition-all duration-500 hover:-translate-y-2 ${
                metric.dark
                  ? "bg-primary text-white shadow-premium"
                  : "bg-white border border-slate-100 shadow-premium"
              }`}
            >
              <div
                className={`p-3 rounded-2xl ${metric.dark ? "bg-accent" : "bg-accent/10 text-accent"}`}
              >
                <metric.icon size={28} />
              </div>
              <span
                className={`text-5xl font-bold tracking-tighter ${metric.dark ? "text-white" : "text-primary"}`}
              >
                {metric.val}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* --- STRATEGY CONTENT SECTION --- */}
        <div className="bg-white rounded-[bento] p-10 md:p-20 lg:p-24 border border-slate-50 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-40 bg-accent rounded-br-full"></div>

          <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-12 flex items-center gap-5 tracking-tight">
            <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center">
              <CheckCircle2 className="text-accent" size={28} />
            </div>
            Strategi & Eksekusi
          </h3>

          <div
            className="prose prose-lg lg:prose-xl prose-slate max-w-none 
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
            prose-headings:text-primary prose-headings:font-bold prose-headings:tracking-tighter
            prose-strong:text-primary prose-strong:font-bold
            font-sans"
          >
            <p className="whitespace-pre-line italic text-slate-500 border-l-4 border-slate-100 pl-8 mb-12 py-2">
              {project.content ||
                "Konten detail mengenai pengerjaan proyek dan tantangan yang dihadapi..."}
            </p>
          </div>

          {/* Footer Branding */}
          <div className="mt-24 pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-premium">
                ON
              </div>
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
                  Team OmzetNaik
                </p>
                <p className="text-[10px] font-medium text-slate-400 italic">
                  Project Strategy & Implementation Lead
                </p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              © 2026 OmzetNaik.id Case Study
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
