// src/pages/ServicesPage.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Search,
  Users,
  Briefcase,
  Zap,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const iconMap: { [key: string]: React.ReactNode } = {
  Ads: <BarChart3 className="text-[#FF3B3B]" size={28} />,
  SEO: <Search className="text-[#FF3B3B]" size={28} />,
  Web: <Briefcase className="text-[#FF3B3B]" size={28} />,
  Property: <Users className="text-[#FF3B3B]" size={28} />,
  Default: <Zap className="text-[#FF3B3B]" size={28} />,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error) setServices(data || []);
      setLoading(false);
    };
    fetchAllServices();
  }, []);

  return (
    <main className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 font-sans">
      <Helmet>
        <title>
          Layanan & Jasa Digital Marketing Terpercaya | OmzetNaik.id
        </title>
        <meta
          name="description"
          content="Pilihan jasa marketing profesional mulai dari Meta Ads, Google Ads, SEO, hingga pengembangan web untuk bisnis properti dan UMKM."
        />
      </Helmet>

      <section className="container mx-auto px-6">
        {/* Header SEO */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B3B]/5 rounded-lg mb-4 border border-[#FF3B3B]/10">
            <Zap size={14} className="text-[#FF3B3B]" />
            <span className="text-[10px] font-black text-[#0F1F4A] uppercase tracking-widest">
              Akselerasi Bisnis
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-[#0F1F4A] leading-tight tracking-tighter mb-6">
            Pilihan <span className="text-[#FF3B3B]">Jasa Kami</span> Untuk
            Pertumbuhan Omzet Anda.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Solusi digital marketing end-to-end yang dikerjakan secara
            profesional, transparan, dan berorientasi pada hasil akhir (ROAS).
          </p>
        </div>

        {/* Grid Jasa */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"
                />
              ))
            : services.map((service) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={service.id}
                  className="bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-[#0F1F4A]/10 transition-all duration-500 group flex flex-col"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-8 group-hover:bg-[#FF3B3B]/10 transition-colors">
                    {iconMap[service.category] || iconMap.Default}
                  </div>

                  <div className="flex-grow">
                    <span className="text-[10px] font-black text-[#FF3B3B] uppercase tracking-widest mb-2 block">
                      {service.category}
                    </span>
                    <h2 className="text-2xl font-heading font-black text-[#0F1F4A] mb-4 group-hover:text-[#FF3B3B] transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Investasi
                      </span>
                      <span className="text-lg font-black text-[#0F1F4A]">
                        Rp {service.price_start?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#0F1F4A] group-hover:bg-[#0F1F4A] group-hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>
      </section>
    </main>
  );
}
