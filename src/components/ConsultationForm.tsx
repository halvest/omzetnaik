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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface untuk opsi layanan agensi
interface ServiceOption {
  id: string;
  title: string;
}

// Interface Data Form sesuai skema tabel 'leads' terbaru
interface ConsultationFormData {
  name: string;
  phone: string;
  email: string;
  domicile: string;
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

  // Ambil data layanan untuk dropdown
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

    // Menangkap parameter UTM untuk kebutuhan agensi marketing
    const urlParams = new URLSearchParams(window.location.search);

    const { error } = await supabase.from("leads").insert([
      {
        type: "service", // Menandai prospek kategori agensi
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        domicile: formData.domisili,
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
      console.error("Error submitting lead:", error);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-neutral-soft relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-primary/5 border border-border max-w-5xl mx-auto overflow-hidden flex flex-col md:flex-row"
        >
          {/* Kolom Kiri: Branding Agensi */}
          <div className="hidden md:flex flex-col justify-between w-2/5 bg-primary p-12 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <MessageSquare size={28} className="text-accent" />
              </div>
              <h3 className="text-3xl font-heading font-extrabold mb-4 leading-tight">
                Konsultasi <br /> Strategi Gratis
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Diskusikan tantangan bisnis Anda dengan pakar performance
                marketing kami. Dapatkan analisis gratis untuk meningkatkan
                omzet Anda.
              </p>

              <ul className="space-y-4">
                {[
                  "Analisis ROI Campaign",
                  "Audit Landing Page",
                  "Strategi Target Audiens",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <Sparkles size={16} className="text-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 pt-8 mt-auto border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp size={20} className="text-green-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Ready to scale up?
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form */}
          <div className="w-full md:w-3/5 p-8 md:p-14">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col justify-center items-center h-full text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                    Permintaan Terkirim!
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    Tim ahli kami akan menghubungi Anda melalui WhatsApp dalam
                    waktu maksimal 1x24 jam.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-accent font-bold hover:underline"
                  >
                    Kirim Pesan Lain
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-heading font-bold text-primary mb-2">
                      Mulai Sekarang
                    </h2>
                    <p className="text-slate-500">
                      Lengkapi data di bawah untuk menjadwalkan sesi
                      brainstorming.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          {...register("name", {
                            required: "Nama wajib diisi",
                          })}
                          className="w-full px-5 py-4 bg-neutral-soft border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Email Bisnis
                        </label>
                        <input
                          {...register("email", {
                            required: "Email wajib diisi",
                          })}
                          className="w-full px-5 py-4 bg-neutral-soft border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                          placeholder="email@bisnis.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          No. WhatsApp
                        </label>
                        <input
                          type="tel"
                          {...register("phone", {
                            required: "No. WA wajib diisi",
                          })}
                          className="w-full px-5 py-4 bg-neutral-soft border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                          placeholder="0812..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Layanan Diminati
                        </label>
                        <select
                          {...register("service_id", {
                            required: "Pilih layanan",
                          })}
                          className="w-full px-5 py-4 bg-neutral-soft border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="">Pilih Jasa...</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Tantangan Bisnis Anda
                      </label>
                      <textarea
                        {...register("message")}
                        rows={3}
                        className="w-full px-5 py-4 bg-neutral-soft border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none resize-none transition-all"
                        placeholder="Ceritakan sedikit tentang target yang ingin Anda capai..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-5 text-lg shadow-accent/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Klaim Konsultasi Gratis"
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
