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
  Home,
  Bed,
  Bath,
  Award,
  Armchair,
  Info,
  Sparkles,
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
  image_url: string;
};

interface PropertyFormModalProps {
  villa?: Partial<FormFields> | null;
  onClose: () => void;
  onSave: () => void;
}

const LISTING_TYPES = ["jual", "sewa"];
const STATUS_OPTIONS = ["active", "pending", "sold", "inactive"];
const FURNISHING_OPTIONS = ["unfurnished", "semi-furnished", "full-furnished"];
const CERTIFICATE_OPTIONS = ["SHM", "HGB", "HAK PAKAI", "Lainnya"];

export default function PropertyFormModal({
  villa,
  onClose,
  onSave,
}: PropertyFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "onChange",
  });

  const STEPS = [
    {
      number: 1,
      title: "Identitas",
      icon: <FileText size={18} />,
      fields: ["title", "property_type", "listing_type"],
    },
    {
      number: 2,
      title: "Spesifikasi",
      icon: <Ruler size={18} />,
      fields: [
        "land_size",
        "building_size",
        "bedrooms",
        "bathrooms",
        "certificate",
        "furnishing",
      ],
    },
    {
      number: 3,
      title: "Finansial",
      icon: <DollarSign size={18} />,
      fields: ["price", "status"],
    },
    {
      number: 4,
      title: "Lokasi",
      icon: <MapPin size={18} />,
      fields: ["city", "district", "address"],
    },
    {
      number: 5,
      title: "Media",
      icon: <Camera size={18} />,
      fields: ["image_url"],
    },
  ];

  useEffect(() => {
    const fetchExistingImages = async () => {
      if (villa?.id) {
        const { data } = await supabase
          .from("property_images")
          .select("image_url")
          .eq("property_id", villa.id)
          .order("sort_order", { ascending: true });
        if (data) setImageList(data.map((img) => img.image_url));
      }
    };

    if (villa) {
      reset(villa);
      if (villa.image_url && !villa.id) setImageList([villa.image_url]);
      fetchExistingImages();
    } else {
      reset({
        listing_type: "jual",
        status: "active",
        furnishing: "unfurnished",
        certificate: "SHM",
        bedrooms: 0,
        bathrooms: 0,
        price: 0,
        is_featured: false,
      });
      setImageList([]);
    }
  }, [villa, reset]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const files = Array.from(e.target.files);
      if (imageList.length + files.length > 5)
        return toast.error("Maksimal 5 foto");

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(`properties/${fileName}`, file);

        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("property-images")
          .getPublicUrl(`properties/${fileName}`);
        newUrls.push(publicUrl);
      }

      const updatedList = [...imageList, ...newUrls];
      setImageList(updatedList);
      if (updatedList.length > 0) setValue("image_url", updatedList[0]);
      toast.success("Foto berhasil diunggah");
    } catch (error: any) {
      toast.error("Gagal unggah: " + error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);
    if (newList.length > 0) setValue("image_url", newList[0]);
    else setValue("image_url", "");
  };

  const onSubmit = async (formData: FormFields) => {
    if (imageList.length === 0) return toast.error("Minimal 1 foto wajib");
    setIsProcessing(true);

    try {
      // 1. FIX DUPLICATE SLUG: Tambahkan suffix unik jika properti baru
      const finalSlug = villa?.id
        ? formData.slug
        : `${slugify(formData.title)}-${Math.floor(Math.random() * 10000)}`;

      const payload = {
        ...formData,
        slug: finalSlug,
        image_url: imageList[0],
        updated_at: new Date().toISOString(),
      };

      // 2. FIX SCHEMA CACHE ERROR: Select 'id' secara eksplisit
      const { data: propData, error: propError } = villa?.id
        ? await supabase
            .from("properties")
            .update(payload)
            .eq("id", villa.id)
            .select("id")
            .single()
        : await supabase
            .from("properties")
            .insert([payload])
            .select("id")
            .single();

      if (propError) throw propError;

      // 3. FIX RLS & SYNC IMAGES
      await supabase
        .from("property_images")
        .delete()
        .eq("property_id", propData.id);

      const imagesPayload = imageList.map((url, index) => ({
        property_id: propData.id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index,
      }));

      const { error: imgError } = await supabase
        .from("property_images")
        .insert(imagesPayload);
      if (imgError) throw imgError;

      toast.success("Listing Berhasil Disimpan");
      onSave();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-primary/40 backdrop-blur-md">
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden font-sans"
      >
        {/* Header */}
        <div className="px-8 h-20 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Home size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-tight">
                {villa?.id ? "Update Listing" : "Tambah Properti Baru"}
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1">
                <Target size={10} className="text-accent" /> Management Terminal
                v2.7
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar bg-slate-50/30">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-12">
              {STEPS.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentStep >= step.number ? "bg-primary text-white shadow-lg" : "bg-white text-slate-300 border border-slate-200"}`}
                    >
                      {currentStep > step.number ? (
                        <Check size={18} />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest ${currentStep === step.number ? "text-primary" : "text-slate-400"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 mb-6 ${currentStep > step.number ? "bg-primary" : "bg-slate-200"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form className="space-y-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                        <Sparkles size={12} className="text-accent" /> Judul
                        Properti
                      </label>
                      <input
                        {...register("title", { required: true })}
                        className="modern-input-v2"
                        placeholder="Contoh: Villa Modern di Seturan"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          Tipe Aset
                        </label>
                        <input
                          {...register("property_type", { required: true })}
                          className="modern-input-v2"
                          placeholder="Rumah / Villa"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          Tipe Iklan
                        </label>
                        <select
                          {...register("listing_type")}
                          className="modern-input-v2 uppercase"
                        >
                          {LISTING_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        Deskripsi
                      </label>
                      <textarea
                        {...register("description")}
                        rows={4}
                        className="modern-input-v2 resize-none"
                        placeholder="Jelaskan detail dan fasilitas..."
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-left">
                          Tanah (m²)
                        </label>
                        <input
                          type="number"
                          {...register("land_size")}
                          className="text-3xl font-bold text-primary bg-transparent text-center border-none w-full outline-none"
                        />
                      </div>
                      <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-left">
                          Bangunan (m²)
                        </label>
                        <input
                          type="number"
                          {...register("building_size")}
                          className="text-3xl font-bold text-primary bg-transparent text-center border-none w-full outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Bed className="text-slate-400 mb-2" size={18} />
                        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          K. Tidur
                        </label>
                        <input
                          type="number"
                          {...register("bedrooms")}
                          className="w-full text-center bg-transparent font-bold text-primary text-lg outline-none"
                        />
                      </div>
                      <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Bath className="text-slate-400 mb-2" size={18} />
                        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          K. Mandi
                        </label>
                        <input
                          type="number"
                          {...register("bathrooms")}
                          className="w-full text-center bg-transparent font-bold text-primary text-lg outline-none"
                        />
                      </div>
                      <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Award className="text-slate-400 mb-2" size={18} />
                        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Sertifikat
                        </label>
                        <select
                          {...register("certificate")}
                          className="bg-transparent text-[10px] font-bold text-primary uppercase text-center outline-none"
                        >
                          {CERTIFICATE_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Armchair className="text-slate-400 mb-2" size={18} />
                        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Furnish
                        </label>
                        <select
                          {...register("furnishing")}
                          className="bg-transparent text-[8px] font-bold text-primary uppercase text-center outline-none"
                        >
                          {FURNISHING_OPTIONS.map((f) => (
                            <option key={f} value={f}>
                              {f.replace("-", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-10 text-center"
                  >
                    <div className="p-12 bg-primary rounded-[3rem] shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
                        <DollarSign size={100} />
                      </div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 block relative z-10">
                        Asking Price (IDR)
                      </label>
                      <div className="flex items-center justify-center gap-4 relative z-10">
                        <span className="text-3xl font-bold text-accent italic">
                          Rp
                        </span>
                        <input
                          type="number"
                          {...register("price", { required: true })}
                          className="bg-transparent border-none text-white text-5xl font-bold focus:ring-0 w-full max-w-[400px] text-center p-0 outline-none"
                        />
                      </div>
                    </div>
                    <div className="max-w-xs mx-auto space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Market Status
                      </label>
                      <select
                        {...register("status")}
                        className="modern-input-v2 uppercase text-center font-bold"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <input
                          type="checkbox"
                          {...register("is_featured")}
                          id="is_featured"
                          className="w-5 h-5 accent-accent rounded"
                        />
                        <label
                          htmlFor="is_featured"
                          className="text-xs font-bold text-primary uppercase cursor-pointer"
                        >
                          Mark as Featured
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          Kota
                        </label>
                        <input
                          {...register("city", { required: true })}
                          className="modern-input-v2"
                          placeholder="Yogyakarta"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          Kecamatan
                        </label>
                        <input
                          {...register("district", { required: true })}
                          className="modern-input-v2"
                          placeholder="Mlati"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        Alamat Lengkap
                      </label>
                      <textarea
                        {...register("address")}
                        rows={3}
                        className="modern-input-v2 resize-none"
                        placeholder="Nama jalan, nomor rumah..."
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imageList.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-2xl overflow-hidden group border border-slate-200"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-bold px-2 py-1 rounded-md uppercase shadow-lg">
                              Main
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {imageList.length < 5 && (
                        <label className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-accent transition-all group">
                          {uploading ? (
                            <Loader2
                              className="animate-spin text-accent"
                              size={24}
                            />
                          ) : (
                            <>
                              <UploadCloud
                                size={24}
                                className="text-slate-300 group-hover:text-accent"
                              />
                              <span className="text-[8px] font-bold uppercase text-slate-400 mt-2">
                                Add Photo ({imageList.length}/5)
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                      <Info
                        size={16}
                        className="text-amber-500 shrink-0 mt-0.5"
                      />
                      <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                        Urutan pertama otomatis menjadi thumbnail utama. Gunakan
                        foto berkualitas tinggi.
                      </p>
                    </div>
                    <input
                      type="hidden"
                      {...register("image_url", {
                        required: "Minimal 1 foto wajib",
                      })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-20">
          <button
            type="button"
            onClick={
              currentStep === 1 ? onClose : () => setCurrentStep((s) => s - 1)
            }
            className="px-8 py-4 bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-widest rounded-2xl border border-slate-100 active:scale-95 transition-all"
          >
            {currentStep === 1 ? "Batal" : "Kembali"}
          </button>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`w-1.5 h-1.5 rounded-full ${currentStep === n ? "bg-accent w-6" : "bg-slate-200"} transition-all duration-300`}
                />
              ))}
            </div>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={async () => {
                  if (await trigger(STEPS[currentStep - 1].fields as any))
                    setCurrentStep((s) => s + 1);
                }}
                className="px-12 py-4 bg-primary text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-primary/95 active:scale-95 transition-all"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isProcessing || uploading}
                className="px-12 py-4 bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-lg disabled:opacity-50 active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {villa?.id ? "Update Listing" : "Deploy Properti"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .modern-input-v2 { width: 100%; padding: 1.1rem 1.4rem; background-color: #F8FAFC; border: 1.5px solid #F1F5F9; border-radius: 1.25rem; font-size: 0.875rem; font-weight: 700; color: #0F172A; transition: all 0.3s; outline: none; }
        .modern-input-v2:focus { border-color: #FF3B3B; background-color: #FFFFFF; box-shadow: 0 10px 25px -10px rgba(15, 31, 74, 0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
