// src/pages/ServiceDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Zap,
  BarChart3,
  Search,
  Users,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const iconMap: { [key: string]: React.ReactNode } = {
  Ads: <BarChart3 className="text-accent" size={32} />,
  SEO: <Search className="text-accent" size={32} />,
  Web: <Briefcase className="text-accent" size={32} />,
  Property: <Users className="text-accent" size={32} />,
  Default: <Zap className="text-accent" size={32} />,
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          navigate("/services");
          return;
        }
        setService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <Loader2 className="animate-spin text-accent mb-4" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Syncing Strategic Offer...
        </p>
      </div>
    );
  }

  const waMessage = `Halo OmzetNaik.id, saya tertarik dengan layanan ${service.title}. Boleh minta detail prosedur dan konsultasi strateginya?`;
  const waLink = `https://wa.me/628123456789?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      <Helmet>
        <title>{service.title} | Strategi Pertumbuhan OmzetNaik.id</title>
        <meta
          name="description"
          content={`Optimalkan ${service.title} Anda bersama OmzetNaik.id. Layanan premium dengan fokus pada ROI dan pertumbuhan bisnis nyata.`}
        />
      </Helmet>

      {/* --- PREMIUM STICKY NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="container h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all group font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Available for Q1 2026
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-[11px] font-bold text-primary truncate max-w-[200px] uppercase">
              {service.title}
            </p>
          </div>

          <a
            href={waLink}
            target="_blank"
            className="btn-primary !px-6 !py-2.5 !text-[10px] shadow-accent-glow"
          >
            Start Consult
          </a>
        </div>
      </nav>

      <main className="pt-32 container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="space-y-12"
        >
          {/* --- HERO HEADER --- */}
          <div className="text-center space-y-8">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full scale-150 opacity-30" />
              <div className="relative w-24 h-24 rounded-[2.5rem] bg-white shadow-premium flex items-center justify-center border border-slate-50">
                {iconMap[service.category] || iconMap.Default}
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/5 text-accent text-[10px] font-bold rounded-full uppercase tracking-[0.25em] border border-accent/10">
                <Sparkles size={12} /> Excellence in {service.category}
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-[0.95] tracking-tighter max-w-4xl mx-auto">
                {service.title}
              </h1>
            </div>

            <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium tracking-tight">
              Solusi strategi marketing presisi yang dirancang khusus untuk
              mengonversi target audiens menjadi{" "}
              <span className="text-primary font-bold">Profit Terukur.</span>
            </p>
          </div>

          {/* --- CONVERSION & PRICING BOX --- */}
          <div className="bg-primary rounded-[bento] p-10 md:p-20 text-white relative overflow-hidden shadow-premium group">
            {/* Background Decor */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-125" />
            <TrendingUp className="absolute right-10 top-10 w-64 h-64 text-white/[0.02] -rotate-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left space-y-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-4">
                    Strategic Investment
                  </p>
                  <h3 className="text-6xl md:text-8xl font-bold tracking-tighter flex items-start justify-center lg:justify-start">
                    <span className="text-3xl mt-2 mr-2 text-slate-400">
                      Rp
                    </span>
                    {service.price_start?.toLocaleString("id-ID")}
                    <span className="text-2xl text-accent ml-2">++</span>
                  </h3>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/10 text-[10px] font-bold uppercase">
                    Monthly Retainer
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/10 text-[10px] font-bold uppercase">
                    Performance Based
                  </div>
                </div>
                <p className="text-slate-400 text-xs font-medium italic opacity-70">
                  *Valuasi akhir menyesuaikan kompleksitas campaign & target
                  KPI.
                </p>
              </div>

              <div className="flex flex-col gap-6 w-full lg:w-96">
                <a
                  href={waLink}
                  target="_blank"
                  className="btn-primary !py-6 !text-sm shadow-accent-glow flex items-center justify-center gap-4 active:scale-95 group/btn"
                >
                  <MessageSquare size={20} /> Lock This Strategy
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </a>
                <div className="flex items-center justify-center gap-6 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      Certified Agency
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      High ROAS Focus
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CONTENT ARCHITECTURE --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Value Proposition */}
            <div className="lg:col-span-7 bg-white p-10 md:p-16 rounded-[bento] border border-slate-100 shadow-premium space-y-12">
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                    <Zap size={24} />
                  </div>
                  Core Deliverables
                </h4>
                <p className="text-slate-400 text-sm font-medium ml-16">
                  Itemized value yang akan Anda dapatkan dalam paket ini.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 ml-4">
                {service.benefit_list?.map((benefit: string, idx: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="flex items-start gap-5 group"
                  >
                    <div className="mt-1 w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 group-hover:text-white transition-colors"
                      />
                    </div>
                    <span className="text-slate-600 font-bold text-lg leading-snug tracking-tight pt-1">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Credibility Sidebar */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-12 rounded-[bento] border border-slate-100 shadow-premium space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-accent opacity-20" />
                <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  Trust Mechanism
                </h4>
                <p className="text-base text-slate-500 leading-relaxed font-medium">
                  Setiap pengerjaan pilar{" "}
                  <span className="text-primary font-bold">
                    Jasa {service.category}
                  </span>{" "}
                  dilakukan oleh spesialis tersertifikasi. Kami tidak
                  menggunakan sistem "one size fits all", melainkan strategi
                  bespoke yang adaptif.
                </p>

                <div className="pt-6 flex flex-col gap-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100"
                          src={`https://i.pravatar.cc/100?img=${i + 20}`}
                          alt="client"
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter leading-tight">
                      Trusted by <br />{" "}
                      <span className="text-primary font-black">
                        50+ Corporate Partners
                      </span>
                    </p>
                  </div>

                  <div className="bg-primary p-8 rounded-3xl text-white relative group cursor-pointer hover:shadow-accent-glow transition-all duration-500">
                    <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-2">
                      Need Custom Quote?
                    </p>
                    <p className="text-sm font-bold leading-snug mb-6">
                      Diskusikan kebutuhan spesifik bisnis Anda dengan
                      Consultant kami.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase underline underline-offset-4">
                        Connect Now
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
