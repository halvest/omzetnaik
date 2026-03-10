// src/components/ConsultationForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import {
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceOption {
  id: string;
  title: string;
}

interface ConsultationFormData {
  name: string;
  phone: string;
  email: string;
  service_id: string;
  message: string;
}

export default function ConsultationForm() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationFormData>();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title")
        .eq("is_active", true);

      if (error) console.error("Error fetching services:", error);
      else setServices(data as ServiceOption[]);
    };
    fetchServices();
  }, []);

  const onSubmit = async (formData: ConsultationFormData) => {
    setIsSubmitting(true);
    const urlParams = new URLSearchParams(window.location.search);

    const { error } = await supabase.from("leads").insert([
      {
        type: "service",
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service_id: formData.service_id,
        message: formData.message,
        status: "new",
        utm_source: urlParams.get("utm_source") || "direct",
        utm_medium: urlParams.get("utm_medium"),
        utm_campaign: urlParams.get("utm_campaign"),
        page_url: window.location.href,
      },
    ]);

    if (error) {
      alert(
        "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi via WhatsApp.",
      );
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 lg:py-40 bg-slate-50 relative overflow-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-0" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="bg-white rounded-[bento] shadow-premium border border-slate-100 max-w-6xl mx-auto overflow-hidden flex flex-col lg:flex-row"
        >
          {/* LEFT COLUMN: Branding & Trust */}
          <div className="lg:w-[40%] bg-primary p-10 lg:p-16 text-white relative flex flex-col justify-between overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-10 shadow-xl"
              >
                <MessageSquare size={32} className="text-accent" />
              </motion.div>

              <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-[1.1] tracking-tighter">
                Konsultasi <br /> Strategi{" "}
                <span className="text-accent italic">Gratis.</span>
              </h3>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                Diskusikan tantangan bisnis Anda dengan pakar performance
                marketing kami. Dapatkan analisis strategis untuk meroketkan
                omzet Anda.
              </p>

              <ul className="space-y-5">
                {[
                  "Analisis ROI Campaign",
                  "Audit Landing Page",
                  "Strategi Target Audiens",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-sm font-semibold tracking-wide text-slate-200"
                  >
                    <div className="p-1 bg-accent/20 rounded-full">
                      <Sparkles size={14} className="text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 pt-10 mt-16 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl shadow-accent-glow">
                  <TrendingUp size={24} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">
                    Status
                  </p>
                  <p className="text-sm font-bold text-white">
                    Ready to scale your business?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="lg:w-[60%] p-10 lg:p-20 relative bg-white">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col justify-center items-center h-full text-center py-10"
                >
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">
                    Permintaan Terkirim!
                  </h3>
                  <p className="text-slate-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                    Tim ahli kami akan menghubungi Anda melalui WhatsApp dalam
                    waktu maksimal{" "}
                    <span className="text-primary font-bold">1x24 jam.</span>
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-accent font-bold hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    Kirim Pesan Lain{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-12">
                    <h2 className="text-4xl font-bold text-primary mb-4 tracking-tighter">
                      Mulai Sekarang
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">
                      Lengkapi data untuk menjadwalkan sesi brainstorming
                      eksklusif.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                          Nama Lengkap
                        </label>
                        <input
                          {...register("name", { required: true })}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none transition-all duration-300 font-medium"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                          Email Bisnis
                        </label>
                        <input
                          {...register("email", { required: true })}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none transition-all duration-300 font-medium"
                          placeholder="email@bisnis.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                          No. WhatsApp
                        </label>
                        <input
                          type="tel"
                          {...register("phone", { required: true })}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none transition-all duration-300 font-medium"
                          placeholder="0812..."
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                          Layanan Diminati
                        </label>
                        <div className="relative">
                          <select
                            {...register("service_id", { required: true })}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none appearance-none cursor-pointer transition-all duration-300 font-medium"
                          >
                            <option value="">Pilih Jasa...</option>
                            {services.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ArrowRight size={18} className="rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Tantangan Bisnis Anda
                      </label>
                      <textarea
                        {...register("message")}
                        rows={4}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none resize-none transition-all duration-300 font-medium"
                        placeholder="Ceritakan target yang ingin Anda capai..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary !py-5 text-lg shadow-accent-glow flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Klaim Konsultasi Gratis <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
