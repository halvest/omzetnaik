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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-accent mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
          Menyelaraskan Case Study...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-24">
      <Helmet>
        <title>{project.title} | Case Study OmzetNaik.id</title>
        <meta name="description" content={project.description} />
        <meta property="og:image" content={project.image_url} />
      </Helmet>

      {/* --- STICKY TOP NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4">
        <div className="container h-20 flex items-center justify-between mx-auto">
          {/* TOMBOL BACK FUNGSIONAL */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-slate-500 hover:text-accent transition-all group"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
              Kembali
            </span>
          </button>

          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={handleShare}
              className="p-3 bg-slate-50 text-slate-400 hover:text-accent rounded-xl border border-slate-100 transition-all active:scale-90"
            >
              <Share2 size={18} />
            </button>
            <a
              href={`https://wa.me/628123456789?text=Halo OmzetNaik, saya tertarik diskusi project ${project.title}`}
              className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </nav>

      <div className="container max-w-6xl pt-32 lg:pt-40 px-6 mx-auto">
        {/* --- HERO HEADER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-accent text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
              <Sparkles size={14} className="animate-pulse" /> Case Study:{" "}
              {project.category}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tighter">
              {project.title}
            </h1>

            <p className="text-lg lg:text-xl text-slate-500 leading-relaxed font-medium">
              {project.description}
            </p>

            {project.project_url && (
              <div className="pt-4">
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all shadow-sm"
                >
                  Kunjungi Live Website
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-accent/10 rounded-[2.5rem] blur-3xl -z-10 translate-x-4 translate-y-4"></div>
            <img
              src={
                project.image_url ||
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
              }
              className="w-full aspect-square object-cover rounded-[2.5rem] shadow-2xl border border-white"
              alt={project.title}
            />
          </motion.div>
        </div>

        {/* --- IMPACT METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 lg:mb-24">
          {[
            {
              icon: TrendingUp,
              val: project.metric_1_val,
              label: project.metric_1_label,
              accent: true,
            },
            {
              icon: Target,
              val: project.metric_2_val,
              label: project.metric_2_label,
            },
            {
              icon: Layers,
              val: project.metric_3_val,
              label: project.metric_3_label,
            },
          ].map((metric, i) => (
            <div
              key={i}
              className={`p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 border transition-all hover:-translate-y-2 ${
                metric.accent
                  ? "bg-slate-900 border-slate-900 shadow-xl"
                  : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <div
                className={`p-3 rounded-xl ${metric.accent ? "bg-accent/20 text-accent" : "bg-slate-50 text-slate-400"}`}
              >
                <metric.icon size={24} />
              </div>
              <span
                className={`text-4xl lg:text-5xl font-bold tracking-tighter ${metric.accent ? "text-white" : "text-slate-900"}`}
              >
                {metric.val || "0"}
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-[0.2em] text-slate-400`}
              >
                {metric.label || "Metrics"}
              </span>
            </div>
          ))}
        </div>

        {/* --- STRATEGY CONTENT --- */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 lg:p-20 border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-32 bg-accent rounded-br-full"></div>

          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-10 flex items-center gap-4 tracking-tight">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <CheckCircle2 size={24} />
            </div>
            Strategi & Eksekusi
          </h3>

          <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900">
            {/* FIX: pr-8 -mr-8 inline-block memberikan padding horizontal agar teks miring tidak terpotong browser */}
            <p className="whitespace-pre-line italic text-slate-500 border-l-4 border-slate-100 pl-6 mb-12 py-2 pr-8 -mr-8 inline-block">
              {project.content ||
                "Konten detail case study pengerjaan proyek dan tantangan yang dihadapi..."}
            </p>
          </div>

          {/* Footer Case Study */}
          <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                ON
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Team OmzetNaik
                </p>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest italic">
                  Growth Strategy Lead
                </p>
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              © 2026 OmzetNaik.id Case Study
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
