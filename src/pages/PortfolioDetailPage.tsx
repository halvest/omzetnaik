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
        <Loader2 className="animate-spin text-[#FF3B3B] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F1F4A]">
          Memuat Case Study...
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/portfolio"
            className="flex items-center gap-2 text-slate-400 hover:text-[#0F1F4A] transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
              Kembali
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-3 bg-slate-50 text-slate-400 hover:text-[#FF3B3B] rounded-2xl transition-all"
            >
              <Share2 size={18} />
            </button>
            <a
              href={`https://wa.me/628123456789?text=Saya tertarik dengan hasil kerja Anda di project ${project.title}`}
              className="px-6 py-3 bg-[#0F1F4A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-black transition-all"
            >
              Mulai Project
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 max-w-5xl pt-32">
        {/* Project Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF3B3B]/10 text-[#FF3B3B] text-[10px] font-black rounded-full uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-[#FF3B3B] rounded-full animate-pulse" />
              Case Study: {project.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-[#0F1F4A] leading-[1.1] tracking-tighter">
              {project.title}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              {project.description}
            </p>
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-[#0F1F4A] font-black text-sm group"
              >
                <span className="border-b-2 border-[#FF3B3B] pb-1 group-hover:text-[#FF3B3B] transition-all">
                  Kunjungi Website Live
                </span>
                <ExternalLink size={18} className="text-[#FF3B3B]" />
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#0F1F4A] rounded-[3rem] rotate-2 opacity-5 scale-105 -z-10 transition-transform group-hover:rotate-0"></div>
            <img
              src={
                project.image_url ||
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
              }
              className="w-full aspect-[4/3] object-cover rounded-[3.5rem] shadow-2xl border-4 border-white"
              alt={project.title}
            />
          </motion.div>
        </div>

        {/* Results / Metric Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0F1F4A] p-10 rounded-[3rem] text-white flex flex-col items-center text-center space-y-3 shadow-2xl shadow-primary/20">
            <TrendingUp className="text-[#FF3B3B]" size={32} />
            <span className="text-4xl font-heading font-black">
              {project.metric_1_val || "150%"}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              {project.metric_1_label || "ROAS Increase"}
            </span>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-primary/5 flex flex-col items-center text-center space-y-3">
            <Target className="text-[#FF3B3B]" size={32} />
            <span className="text-4xl font-heading font-black text-[#0F1F4A]">
              {project.metric_2_val || "12k+"}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              {project.metric_2_label || "New Leads"}
            </span>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-primary/5 flex flex-col items-center text-center space-y-3">
            <Layers className="text-[#FF3B3B]" size={32} />
            <span className="text-4xl font-heading font-black text-[#0F1F4A]">
              {project.metric_3_val || "2.4M"}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              {project.metric_3_label || "Ad Impression"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-[4rem] p-10 md:p-20 border border-slate-50 shadow-2xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-32 bg-[#FF3B3B]"></div>

          <h3 className="text-2xl md:text-3xl font-heading font-black text-[#0F1F4A] mb-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF3B3B]/10 flex items-center justify-center">
              <CheckCircle2 className="text-[#FF3B3B]" size={20} />
            </div>
            Strategi & Eksekusi
          </h3>

          <div
            className="prose prose-lg prose-slate max-w-none 
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
            prose-headings:text-[#0F1F4A] prose-headings:font-black
            prose-strong:text-[#0F1F4A]
            font-sans"
          >
            <p>
              {project.content ||
                "Konten detail mengenai pengerjaan proyek dan tantangan yang dihadapi..."}
            </p>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0F1F4A] text-white flex items-center justify-center font-black">
                ON
              </div>
              <div>
                <p className="text-xs font-black text-[#0F1F4A] uppercase tracking-widest">
                  Team OmzetNaik
                </p>
                <p className="text-[10px] font-bold text-slate-400">
                  Project Strategy & Implementation
                </p>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              © 2026 OmzetNaik.id Portfolio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
