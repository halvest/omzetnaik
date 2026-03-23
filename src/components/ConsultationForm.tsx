import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsultationForm() {
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, title")
        .eq("is_active", true);
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from("leads")
      .insert([{ ...formData, status: "new", type: "consultation" }]);
    if (error) {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen lg:h-screen flex items-center justify-center bg-[#F8FAFC] py-8 lg:py-0 overflow-hidden font-sans"
    >
      {/* Glow Effect Ambiance */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-0" />

      <div className="container relative z-10 px-4 lg:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl border border-slate-200 max-w-5xl mx-auto overflow-hidden flex flex-col lg:flex-row lg:max-h-[850px]"
        >
          {/* SISI KIRI: BRANDING & TRUST (DARK MODE CONTRAST) */}
          <div className="lg:w-[38%] bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Dekorasi Cahaya */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full mb-6">
                <Sparkles size={12} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                  Free Consultation
                </span>
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold leading-[1.25] tracking-tight mb-6">
                {/* PERBAIKAN: "Siap Naikkan" dibuat warna putih */}
                <span className="text-white">Siap Naikkan</span> <br />
                {/* PERBAIKAN: "Omzet Bisnis?" teks biasa, jangan miring, gradien tetap */}
                <span className="relative inline-block py-1">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400 not-italic">
                    Omzet Bisnis?
                  </span>
                  <div className="absolute -bottom-1 left-0 right-0 h-2 bg-accent/10 -z-10 rounded-full" />
                </span>
              </h2>

              <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8 font-medium">
                Dapatkan audit strategi marketing 1-on-1 dengan tim expert kami
                secara gratis.
              </p>

              <div className="space-y-4">
                {[
                  "Audit Strategi Iklan (Meta/Google)",
                  "Analisis Kompetitor & Market",
                  "Optimasi Funnel Konversi",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs font-semibold text-slate-200"
                  >
                    <CheckCircle2 size={16} className="text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-accent" />
              </div>
              <p className="text-[11px] font-medium text-slate-300 leading-tight">
                Data Anda aman bersama kami. <br />
                Kerahasiaan strategi dijamin 100%.
              </p>
            </div>
          </div>

          {/* SISI KANAN: FORMULIR (HIGH CONTRAST) */}
          <div className="lg:w-[62%] p-8 lg:p-12 bg-white overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Permintaan Terkirim!
                  </h3>
                  <p className="text-slate-500 text-sm mb-8">
                    Tim kami akan menghubungi Anda via WhatsApp dalam 24 jam.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-accent font-bold text-sm flex items-center gap-2 hover:underline"
                  >
                    Kirim Pesan Lain <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Lengkapi Data Anda
                    </h3>
                    <p className="text-slate-500 text-sm font-medium italic underline underline-offset-4 decoration-accent/20">
                      Slot konsultasi terbatas setiap bulannya.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        {/* KONTRAS: Menggunakan text-slate-900 (Hitam Pekat) agar sangat jelas */}
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">
                          Nama Lengkap
                        </label>
                        <input
                          {...register("name", { required: true })}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none text-sm transition-all focus:bg-white text-slate-900 font-medium"
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            Wajib diisi
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">
                          WhatsApp Business
                        </label>
                        <input
                          type="tel"
                          {...register("phone", { required: true })}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none text-sm transition-all focus:bg-white text-slate-900 font-medium"
                          placeholder="08123456789"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">
                          Email Bisnis
                        </label>
                        <input
                          type="email"
                          {...register("email", { required: true })}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none text-sm transition-all focus:bg-white text-slate-900 font-medium"
                          placeholder="email@bisnis.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">
                          Pilih Layanan
                        </label>
                        <select
                          {...register("service_id", { required: true })}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none text-sm appearance-none cursor-pointer font-bold text-slate-900"
                        >
                          <option value="">Pilih...</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">
                        Tantangan Bisnis
                      </label>
                      <textarea
                        {...register("message")}
                        rows={3}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none resize-none text-sm focus:bg-white text-slate-900 font-medium"
                        placeholder="Apa target omzet yang ingin Anda capai?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-slate-900 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Klaim Konsultasi Gratis Sekarang{" "}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Respon Cepat via WhatsApp
                    </p>
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
