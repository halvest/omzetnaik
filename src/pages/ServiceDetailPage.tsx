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
} from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const iconMap: { [key: string]: React.ReactNode } = {
  Ads: <BarChart3 className="text-[#FF3B3B]" size={32} />,
  SEO: <Search className="text-[#FF3B3B]" size={32} />,
  Web: <Briefcase className="text-[#FF3B3B]" size={32} />,
  Property: <Users className="text-[#FF3B3B]" size={32} />,
  Default: <Zap className="text-[#FF3B3B]" size={32} />,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#FF3B3B] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Menyiapkan Penawaran...
        </p>
      </div>
    );
  }

  const waMessage = `Halo OmzetNaik.id, saya ingin konsultasi mengenai Jasa ${service.title}. Bagaimana prosedur kerjanya?`;
  const waLink = `https://wa.me/628123456789?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-20">
      <Helmet>
        <title>Jasa {service.title} Terbaik & Terukur | OmzetNaik.id</title>
        <meta
          name="description"
          content={`Tingkatkan profit bisnis Anda dengan jasa ${service.title.toLowerCase()} dari OmzetNaik.id. Strategi berbasis data untuk hasil yang nyata.`}
        />
      </Helmet>

      {/* --- STICKY HEADER NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-[#0F1F4A] transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F1F4A]">
              Available for Project
            </p>
          </div>
          <a
            href={waLink}
            target="_blank"
            className="px-6 py-2.5 bg-[#0F1F4A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-[#FF3B3B] transition-all"
          >
            Konsultasi Gratis
          </a>
        </div>
      </nav>

      <main className="pt-32 container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* --- HERO SECTION --- */}
          <div className="text-center space-y-6">
            <div className="inline-flex w-20 h-20 rounded-[2rem] bg-white shadow-2xl shadow-primary/5 items-center justify-center mx-auto border border-slate-50">
              {iconMap[service.category] || iconMap.Default}
            </div>
            <div className="space-y-3">
              <span className="px-4 py-1.5 bg-[#FF3B3B]/5 text-[#FF3B3B] text-[10px] font-black rounded-full uppercase tracking-widest border border-[#FF3B3B]/10">
                Premium Jasa {service.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-black text-[#0F1F4A] leading-[1.1] tracking-tighter max-w-3xl mx-auto">
                {service.title}
              </h1>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Solusi strategi marketing presisi yang dirancang khusus untuk
              mengonversi target audiens menjadi <strong>Omzet Nyata</strong>{" "}
              bagi bisnis Anda.
            </p>
          </div>

          {/* --- PRICING & CTA CARD --- */}
          <div className="bg-[#0F1F4A] rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/5">
            <TrendingUp className="absolute -right-10 -bottom-10 w-64 h-64 text-white/[0.03] -rotate-12" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF3B3B] mb-4">
                  Investasi Strategis
                </p>
                <h3 className="text-5xl md:text-6xl font-heading font-black tracking-tighter">
                  <span className="text-2xl align-top mr-1 font-bold text-slate-400">
                    Rp
                  </span>
                  {service.price_start?.toLocaleString("id-ID")}
                  <span className="text-lg text-slate-400 font-bold">++</span>
                </h3>
                <p className="text-slate-400 text-xs mt-4 font-medium italic">
                  *Harga menyesuaikan skala campaign dan target ROAS.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <a
                  href={waLink}
                  target="_blank"
                  className="w-full lg:px-12 py-5 bg-[#FF3B3B] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  <MessageSquare size={18} /> Ambil Penawaran Ini
                </a>
                <div className="flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Guaranteed Service
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- DETAILS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Benefits List */}
            <div className="md:col-span-7 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF3B3B]/10 flex items-center justify-center">
                  <Zap size={20} className="text-[#FF3B3B]" />
                </div>
                <h4 className="text-xl font-heading font-black text-[#0F1F4A] tracking-tight">
                  Apa yang Anda Dapatkan?
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {service.benefit_list?.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors duration-300">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 group-hover:text-white transition-colors"
                      />
                    </div>
                    <span className="text-slate-600 font-bold text-base leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Branding */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-[#F1F5F9] p-10 rounded-[3rem] space-y-6 flex-1 flex flex-col justify-center">
                <h4 className="text-sm font-black uppercase tracking-widest text-[#0F1F4A]">
                  Why OmzetNaik.id?
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Setiap pengerjaan{" "}
                  <strong>jasa {service.category.toLowerCase()}</strong>{" "}
                  dilakukan oleh tim spesialis bersertifikat. Kami fokus pada
                  angka akhir: <strong>Profit & Growth</strong>, bukan sekadar
                  vanity metrics.
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"
                      >
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 40}`}
                          alt="client"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                    Success with 50+ Partners
                  </p>
                </div>
              </div>

              {/* Micro CTA Box */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#FF3B3B] transition-all">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Butuh Custom Paket?
                  </p>
                  <p className="text-sm font-black text-[#0F1F4A]">
                    Hubungi Team Ahli Kami
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#FF3B3B] group-hover:text-white transition-all">
                  <ArrowLeft className="rotate-180" size={18} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
