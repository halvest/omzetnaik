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
  Layers,
  Sparkles,
  Info,
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

const StepIndicator = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: any[];
}) => (
  <div className="flex items-center justify-between mb-12 px-2">
    {steps.map((step, index) => (
      <React.Fragment key={step.number}>
        <div className="flex flex-col items-center relative z-10">
          <motion.div
            animate={{
              scale: currentStep === step.number ? 1.1 : 1,
              backgroundColor:
                currentStep >= step.number ? "#0F1F4A" : "#F1F5F9",
              color: currentStep >= step.number ? "#FFFFFF" : "#94A3B8",
            }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white"
          >
            {currentStep > step.number ? (
              <Check size={20} strokeWidth={3} />
            ) : (
              step.icon
            )}
          </motion.div>
          <span
            className={`absolute -bottom-7 text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${currentStep === step.number ? "text-primary" : "text-slate-400"}`}
          >
            {step.title}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className="flex-1 h-1 mx-4 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: currentStep > step.number ? "100%" : "0%" }}
              className="absolute inset-0 bg-accent"
            />
          </div>
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

  const STEPS = [
    {
      number: 1,
      title: "Identity",
      icon: <FileText size={18} />,
      fields: ["title", "property_type", "listing_type"],
    },
    {
      number: 2,
      title: "Specs",
      icon: <Ruler size={18} />,
      fields: ["land_size", "building_size", "bedrooms", "bathrooms"],
    },
    {
      number: 3,
      title: "Finance",
      icon: <DollarSign size={18} />,
      fields: ["price", "status"],
    },
    {
      number: 4,
      title: "Location",
      icon: <MapPin size={18} />,
      fields: ["city", "district", "address"],
    },
    {
      number: 5,
      title: "Asset",
      icon: <Camera size={18} />,
      fields: ["image_url"],
    },
  ];

  useEffect(() => {
    if (villa) {
      reset(villa);
      if (villa.image_url) setPreviewImage(villa.image_url);
    } else {
      reset({
        listing_type: "jual",
        status: "active",
        furnishing: "unfurnished",
        is_featured: false,
        bedrooms: 0,
        bathrooms: 0,
        price: 0,
      });
      setPreviewImage(null);
    }
  }, [villa, reset]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileName = `prop_${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(`properties/${fileName}`, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("property-images")
        .getPublicUrl(`properties/${fileName}`);
      setValue("image_url", publicUrl);
      setPreviewImage(publicUrl);
      toast.success("Asset verified and uploaded");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
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
        villa?.id ? "Records updated" : "Listing deployed successfully",
      );
      onSave();
    } catch (err: any) {
      toast.error(err.message || "System error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = STEPS[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, 5));
    else toast.error("Validation failed. Please check mandatory fields.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 bg-primary/40 backdrop-blur-md">
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[94vh] sm:rounded-[bento] flex flex-col shadow-premium overflow-hidden font-sans"
      >
        {/* Header */}
        <div className="px-10 h-20 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-accent-glow">
              <Home size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-tight">
                {villa?.id ? "Update Inventory Record" : "Deploy New Listing"}
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                Asset Control Console
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

        {/* Body Content Area */}
        <div className="flex-1 overflow-y-auto px-10 py-12 no-scrollbar bg-slate-50/30">
          <div className="max-w-2xl mx-auto">
            <StepIndicator currentStep={currentStep} steps={STEPS} />

            <form className="mt-16 space-y-10">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                        <Info size={12} className="text-accent" /> Headline
                        Identity
                      </label>
                      <input
                        {...register("title", { required: true })}
                        className="modern-input-v2"
                        placeholder="e.g. Modern Minimalist Villa Seturan"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                          Classification
                        </label>
                        <input
                          {...register("property_type", { required: true })}
                          className="modern-input-v2"
                          placeholder="Rumah/Villa/Ruko"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                          Transaction Mode
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
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                          Land Area (m²)
                        </label>
                        <input
                          type="number"
                          {...register("land_size")}
                          className="text-4xl font-bold text-primary bg-transparent text-center border-none focus:ring-0 w-full"
                        />
                      </div>
                      <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                          Building Area (m²)
                        </label>
                        <input
                          type="number"
                          {...register("building_size")}
                          className="text-4xl font-bold text-primary bg-transparent text-center border-none focus:ring-0 w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { name: "bedrooms", label: "Beds" },
                        { name: "bathrooms", label: "Baths" },
                        {
                          name: "is_featured",
                          label: "Featured?",
                          type: "checkbox",
                        },
                      ].map((f) => (
                        <div
                          key={f.name}
                          className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed"
                        >
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                            {f.label}
                          </label>
                          {f.type === "checkbox" ? (
                            <input
                              type="checkbox"
                              {...register(f.name as any)}
                              className="w-6 h-6 accent-primary"
                            />
                          ) : (
                            <input
                              type="number"
                              {...register(f.name as any)}
                              className="w-full text-center bg-transparent font-bold text-xl text-primary border-none focus:ring-0 p-0"
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
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-10 text-center"
                  >
                    <div className="p-12 bg-primary rounded-[3rem] shadow-premium relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <DollarSign size={80} />
                      </div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 block relative z-10">
                        Asking Price Portfolio
                      </label>
                      <div className="flex items-center justify-center gap-4 relative z-10">
                        <span className="text-3xl font-bold text-accent italic">
                          Rp
                        </span>
                        <input
                          type="number"
                          {...register("price", { required: true })}
                          className="bg-transparent border-none text-white text-5xl font-bold focus:ring-0 w-full max-w-[300px] p-0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="max-w-xs mx-auto space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Market Exposure Status
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
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          City/Province
                        </label>
                        <input
                          {...register("city", { required: true })}
                          className="modern-input-v2"
                          placeholder="e.g. Yogyakarta"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          District
                        </label>
                        <input
                          {...register("district", { required: true })}
                          className="modern-input-v2"
                          placeholder="e.g. Sleman"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        Full Logistics Address
                      </label>
                      <textarea
                        {...register("address")}
                        rows={4}
                        className="modern-input-v2 resize-none leading-relaxed"
                        placeholder="Complete coordinate address..."
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="aspect-video bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-accent/40 transition-all duration-500">
                      {previewImage ? (
                        <>
                          <img
                            src={previewImage}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt=""
                          />
                          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(null);
                                setValue("image_url", "");
                              }}
                              className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg"
                            >
                              Change Asset
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer text-center flex flex-col items-center group/label p-10">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover/label:bg-accent group-hover/label:text-white transition-all shadow-sm">
                            <UploadCloud size={32} />
                          </div>
                          <h4 className="text-primary font-bold tracking-tight text-lg mb-2">
                            Upload Master Asset
                          </h4>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                            Recommended: High-Res 4:3 Aspect Ratio
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                          />
                        </label>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-3">
                          <Loader2
                            className="animate-spin text-accent"
                            size={32}
                          />
                          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em]">
                            Syncing Asset...
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="hidden"
                      {...register("image_url", { required: true })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-6 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={
              currentStep === 1 ? onClose : () => setCurrentStep((s) => s - 1)
            }
            className="px-8 py-3.5 bg-white text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all shadow-sm"
          >
            {currentStep === 1 ? "Discard" : "Previous Step"}
          </button>

          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`w-1.5 h-1.5 rounded-full ${currentStep === n ? "bg-accent w-4" : "bg-slate-200"} transition-all`}
                />
              ))}
            </div>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary !px-12 !py-3.5 !text-[11px] flex items-center gap-3 shadow-accent-glow"
              >
                Next Sequence <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isProcessing || uploading}
                className="btn-primary !bg-emerald-500 !px-12 !py-3.5 !text-[11px] flex items-center gap-3 shadow-emerald-200/50 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Confirm & Deploy
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .modern-input-v2 { width: 100%; padding: 1.25rem 1.5rem; background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 1.5rem; font-size: 0.875rem; font-weight: 700; color: #0F172A; transition: all 0.3s; outline: none; }
        .modern-input-v2:focus { border-color: #FF3B3B; background-color: #FFFFFF; box-shadow: 0 10px 20px -10px rgba(15, 31, 74, 0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
