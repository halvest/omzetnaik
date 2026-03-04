// src/components/PropertyFormModal.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import {
  X,
  Save,
  Check,
  FileText,
  DollarSign,
  MapPin,
  Trash2,
  Loader2,
  Ruler,
  ChevronRight,
  Target,
  Camera,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const slugify = (text: string) =>
  text
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") || "";

type FormFields = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  listing_type: "jual" | "sewa";
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  land_size: number;
  building_size: number;
  certificate: string;
  furnishing: "unfurnished" | "semi-furnished" | "full-furnished";
  address: string;
  city: string;
  district: string;
  status: "active" | "pending" | "sold" | "inactive";
  is_featured: boolean;
  image_url: string; // Tambahkan field ini
};

interface PropertyFormModalProps {
  villa?: Partial<FormFields> | null;
  onClose: () => void;
  onSave: () => void;
}

const LISTING_TYPES = ["jual", "sewa"];
const STATUS_OPTIONS = ["active", "pending", "sold", "inactive"];
const FURNISHING_OPTIONS = ["unfurnished", "semi-furnished", "full-furnished"];

const StepIndicator = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: any[];
}) => (
  <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 no-scrollbar">
    {steps.map((step, index) => (
      <React.Fragment key={step.number}>
        <div className="flex flex-col items-center min-w-[70px]">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
              currentStep >= step.number
                ? "bg-[#0F1F4A] text-white shadow-[#0F1F4A]/20"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {currentStep > step.number ? (
              <Check size={20} strokeWidth={3} />
            ) : (
              step.icon
            )}
          </div>
          <span
            className={`mt-2 text-[9px] font-black uppercase tracking-widest ${
              currentStep === step.number ? "text-[#0F1F4A]" : "text-slate-400"
            }`}
          >
            {step.title}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            className={`flex-1 h-[2px] mx-2 mb-6 min-w-[20px] transition-colors duration-500 ${
              currentStep > step.number ? "bg-[#0F1F4A]" : "bg-slate-100"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default function PropertyFormModal({
  villa,
  onClose,
  onSave,
}: PropertyFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "onChange",
  });

  useEffect(() => {
    if (villa) {
      reset(villa);
      if (villa.image_url) setPreviewImage(villa.image_url);
    } else {
      reset({
        listing_type: "jual",
        status: "pending",
        furnishing: "unfurnished",
        is_featured: false,
        bedrooms: 0,
        bathrooms: 0,
        price: 0,
      });
      setPreviewImage(null);
    }
  }, [villa, reset]);

  const STEPS = [
    {
      number: 1,
      title: "Informasi",
      icon: <FileText size={20} />,
      fields: ["title", "property_type", "listing_type"],
    },
    {
      number: 2,
      title: "Spesifikasi",
      icon: <Ruler size={20} />,
      fields: ["land_size", "building_size", "bedrooms"],
    },
    {
      number: 3,
      title: "Finansial",
      icon: <DollarSign size={20} />,
      fields: ["price", "status"],
    },
    {
      number: 4,
      title: "Lokasi",
      icon: <MapPin size={20} />,
      fields: ["city", "district", "address"],
    },
    {
      number: 5,
      title: "Media",
      icon: <Camera size={20} />,
      fields: ["image_url"],
    },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(filePath);

      setValue("image_url", publicUrl);
      setPreviewImage(publicUrl);
      toast.success("Foto berhasil diunggah");
    } catch (error: any) {
      toast.error("Gagal unggah foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData: FormFields) => {
    setIsProcessing(true);
    try {
      const finalData = {
        ...formData,
        slug: formData.slug || slugify(formData.title),
        updated_at: new Date().toISOString(),
      };

      const { error } = villa?.id
        ? await supabase.from("properties").update(finalData).eq("id", villa.id)
        : await supabase.from("properties").insert([finalData]);

      if (error) throw error;

      toast.success(
        villa?.id ? "Data diperbarui" : "Listing berhasil dipublish",
      );
      onSave();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = STEPS[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, 5));
    else toast.error("Mohon lengkapi data yang wajib diisi");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-[#0F1F4A]/60 backdrop-blur-md">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[95vh] sm:rounded-[3rem] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF3B3B] text-white rounded-xl">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#0F1F4A] leading-none uppercase tracking-tighter">
                {villa?.id ? "Edit Properti" : "Post Properti Baru"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                CMS OmzetNaik.id
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-neutral-soft text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
          <StepIndicator currentStep={currentStep} steps={STEPS} />

          <form className="max-w-2xl mx-auto pb-10">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="label-style">
                      Judul Listing <span className="text-accent">*</span>
                    </label>
                    <input
                      {...register("title", { required: "Judul wajib diisi" })}
                      className={`modern-input ${errors.title ? "border-red-500" : ""}`}
                      placeholder="Contoh: Villa Scandinavia Seturan"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-style">Tipe Properti</label>
                      <input
                        {...register("property_type", { required: true })}
                        className="modern-input"
                        placeholder="Rumah/Villa/Kavling"
                      />
                    </div>
                    <div>
                      <label className="label-style">Jenis Listing</label>
                      <select
                        {...register("listing_type")}
                        className="modern-input uppercase font-bold"
                      >
                        {LISTING_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label-style">Deskripsi Singkat</label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="modern-input"
                      placeholder="Jelaskan nilai jual utama properti..."
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-style text-center">
                        Luas Tanah (m²)
                      </label>
                      <input
                        type="number"
                        {...register("land_size", { valueAsNumber: true })}
                        className="modern-input text-center text-xl font-black"
                      />
                    </div>
                    <div>
                      <label className="label-style text-center">
                        Luas Bangunan (m²)
                      </label>
                      <input
                        type="number"
                        {...register("building_size", { valueAsNumber: true })}
                        className="modern-input text-center text-xl font-black"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 bg-neutral-soft p-6 rounded-[2rem]">
                    {[
                      { name: "bedrooms", label: "Kamar Tidur" },
                      { name: "bathrooms", label: "Kamar Mandi" },
                      {
                        name: "is_featured",
                        label: "Unggulan?",
                        type: "checkbox",
                      },
                    ].map((f) => (
                      <div key={f.name} className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2">
                          {f.label}
                        </label>
                        {f.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            {...register(f.name as any)}
                            className="w-6 h-6 accent-[#0F1F4A]"
                          />
                        ) : (
                          <input
                            type="number"
                            {...register(f.name as any, {
                              valueAsNumber: true,
                            })}
                            className="modern-input text-center p-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 text-center"
                >
                  <div className="p-10 bg-primary-50 rounded-[3rem] border-2 border-primary-100">
                    <label className="text-sm font-black text-[#0F1F4A] uppercase tracking-widest mb-4 block">
                      Harga Penawaran
                    </label>
                    <div className="relative inline-block w-full">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#0F1F4A]/30 text-2xl">
                        Rp
                      </span>
                      <input
                        type="number"
                        {...register("price", {
                          required: true,
                          valueAsNumber: true,
                        })}
                        className="modern-input pl-20 text-3xl font-black text-[#0F1F4A] bg-white border-none shadow-xl"
                      />
                    </div>
                  </div>
                  <div className="max-w-xs mx-auto">
                    <label className="label-style">Status Publikasi</label>
                    <select
                      {...register("status")}
                      className="modern-input text-center uppercase font-bold"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-left"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-style">Kota</label>
                      <input
                        {...register("city", { required: true })}
                        className="modern-input"
                        placeholder="Yogyakarta"
                      />
                    </div>
                    <div>
                      <label className="label-style">Kecamatan</label>
                      <input
                        {...register("district", { required: true })}
                        className="modern-input"
                        placeholder="Sleman"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">Alamat Lengkap</label>
                    <textarea
                      {...register("address")}
                      rows={3}
                      className="modern-input"
                      placeholder="Jl. Nama Jalan No. XX..."
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="s5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 text-center relative overflow-hidden">
                    {previewImage ? (
                      <div className="relative group aspect-video">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setValue("image_url", "");
                          }}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-10 flex flex-col items-center">
                        <UploadCloud
                          size={48}
                          className="text-slate-300 mb-4"
                        />
                        <h4 className="text-[#0F1F4A] font-bold">
                          Pilih Foto Utama
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 mb-6">
                          Format JPG, PNG, WEBP (Max 2MB)
                        </p>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleUpload}
                          disabled={uploading}
                        />
                        <label
                          htmlFor="file-upload"
                          className="px-6 py-3 bg-[#0F1F4A] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-black transition-all flex items-center gap-2"
                        >
                          {uploading ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Camera size={16} />
                          )}
                          {uploading ? "Mengunggah..." : "Pilih File"}
                        </label>
                      </div>
                    )}
                    <input
                      type="hidden"
                      {...register("image_url", {
                        required: "Foto utama wajib diunggah",
                      })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-neutral-soft flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={
              currentStep === 1 ? onClose : () => setCurrentStep((s) => s - 1)
            }
            className="px-8 py-4 bg-white text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            {currentStep === 1 ? "Batal" : "Kembali"}
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-12 py-4 bg-[#0F1F4A] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all flex items-center gap-2"
            >
              Selanjutnya <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isProcessing || uploading}
              className="px-12 py-4 bg-[#FF3B3B] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-[#E22F2F] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isProcessing ? "Menyimpan..." : "Konfirmasi & Publish"}
            </button>
          )}
        </div>
      </motion.div>

      <style>{`
        .label-style { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 0.5rem; display: block; }
        .modern-input { width: 100%; padding: 1.25rem 1.5rem; background-color: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 1.5rem; font-size: 0.875rem; font-weight: 700; color: #0F172A; transition: all 0.3s; }
        .modern-input:focus { outline: none; background-color: #FFFFFF; border-color: #0F1F4A; box-shadow: 0 10px 15px -3px rgba(15, 31, 74, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
