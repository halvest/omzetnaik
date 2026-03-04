// src/components/ServiceFormModal.tsx
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { supabase } from "../utils/supabase";
import {
  X,
  Save,
  Plus,
  Trash2,
  Loader2,
  Target,
  Image as ImageIcon,
  CheckCircle2,
  UploadCloud,
  Layout,
  Settings,
  DollarSign,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type ServiceFields = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price_start: number;
  image_url: string;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  benefit_list: { value: string }[];
};

interface Props {
  service?: any | null;
  onClose: () => void;
  onSave: () => void;
}

const slugify = (text: string) =>
  text
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") || "";

export default function ServiceFormModal({ service, onClose, onSave }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<ServiceFields>({
      defaultValues: {
        is_active: true,
        is_featured: false,
        benefit_list: [{ value: "" }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefit_list",
  });

  const currentTitle = watch("title");
  const currentImage = watch("image_url");

  useEffect(() => {
    if (service) {
      const formattedBenefits = service.benefit_list?.map((b: string) => ({
        value: b,
      })) || [{ value: "" }];
      reset({ ...service, benefit_list: formattedBenefits });
    } else {
      reset({
        title: "",
        category: "Ads",
        price_start: 0,
        description: "",
        is_active: true,
        is_featured: false,
        benefit_list: [{ value: "" }],
        image_url: "",
      });
    }
  }, [service, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `services/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName);

      setValue("image_url", publicUrl);
      toast.success("Gambar layanan diperbarui");
    } catch (error: any) {
      toast.error("Gagal upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ServiceFields) => {
    setIsProcessing(true);
    try {
      const finalData = {
        ...data,
        slug: data.slug || slugify(data.title),
        benefit_list: data.benefit_list
          .map((item) => item.value)
          .filter((val) => val !== ""),
        updated_at: new Date().toISOString(),
      };

      const { error } = service?.id
        ? await supabase.from("services").update(finalData).eq("id", service.id)
        : await supabase.from("services").insert([finalData]);

      if (error) throw error;

      toast.success(
        service?.id ? "Layanan diperbarui" : "Layanan baru diterbitkan",
      );
      onSave();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1F4A]/40 backdrop-blur-sm p-0 sm:p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F8FAFC] w-full max-w-[95vw] h-full sm:h-[90vh] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* TOP BAR */}
        <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#FF3B3B] text-white rounded-xl shadow-lg shadow-red-600/20">
              <Layout size={18} strokeWidth={3} />
            </div>
            <h2 className="font-heading font-extrabold text-[#0F1F4A] truncate max-w-[200px] md:max-w-md uppercase tracking-tighter">
              {currentTitle || "Layanan Baru"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all font-bold text-xs uppercase px-4"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isProcessing || uploading}
              className="px-8 py-3 bg-[#0F1F4A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Simpan Layanan
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* MAIN FORM (LEFT) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-10">
              <div className="space-y-4">
                <input
                  {...register("title", { required: true })}
                  placeholder="Nama Layanan (e.g. Meta Ads Scaler)"
                  className="w-full text-4xl md:text-5xl font-heading font-extrabold text-[#0F1F4A] placeholder:text-slate-100 border-none focus:ring-0 p-0 leading-tight outline-none"
                />
                <div className="h-1.5 w-24 bg-[#FF3B3B] rounded-full" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileText size={14} /> Deskripsi Paket
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Jelaskan detail layanan ini kepada klien..."
                  className="w-full text-lg text-slate-600 leading-relaxed border-none focus:ring-0 p-0 min-h-[150px] resize-none outline-none"
                />
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-50">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                  Benefit & Fitur
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 group">
                      <input
                        {...register(`benefit_list.${index}.value` as const)}
                        className="flex-grow p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#0F1F4A] focus:bg-white outline-none font-bold text-sm text-[#0F1F4A]"
                        placeholder="Poin benefit..."
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:border-[#0F1F4A] hover:text-[#0F1F4A] transition-all bg-white"
                  >
                    <Plus size={16} /> Tambah Benefit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (RIGHT) */}
          <aside className="w-full lg:w-[380px] bg-[#F8FAFC] border-l border-slate-200 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F1F4A] text-[10px] font-black uppercase tracking-widest">
                <Settings size={14} className="text-[#FF3B3B]" /> Konfigurasi
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    Kategori
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0F1F4A] outline-none focus:ring-2 focus:ring-[#0F1F4A]/5"
                  >
                    <option value="Ads">Ads Management</option>
                    <option value="SEO">SEO Search</option>
                    <option value="Web">Web Dev</option>
                    <option value="Property">Property</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    Harga Mulai (Rp)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      type="number"
                      {...register("price_start")}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0F1F4A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F1F4A] text-[10px] font-black uppercase tracking-widest">
                <ImageIcon size={14} className="text-[#FF3B3B]" /> Media Cover
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="aspect-video w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 relative overflow-hidden group">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() => setValue("image_url", "")}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center font-bold text-xs uppercase tracking-widest"
                      >
                        Ganti Gambar
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      <UploadCloud size={32} className="text-slate-300 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase text-center px-4">
                        Upload Thumbnail
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#FF3B3B]" />
                    </div>
                  )}
                </div>
                <input type="hidden" {...register("image_url")} />
              </div>
            </div>

            <div className="p-6 bg-[#0F1F4A] rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-primary/20">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="w-5 h-5 accent-[#FF3B3B]"
                />
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#FF3B3B] transition-colors">
                  Layanan Aktif
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("is_featured")}
                  className="w-5 h-5 accent-[#FF3B3B]"
                />
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#FF3B3B] transition-colors">
                  Featured on Home
                </span>
              </label>
            </div>
          </aside>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
