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
  Zap,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      toast.success("Service thumbnail deployed");
    } catch (error: any) {
      toast.error("Asset sync failed");
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

      toast.success(service?.id ? "Catalog updated" : "New service activated");
      onSave();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 backdrop-blur-md p-0 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-6xl h-full sm:h-[94vh] sm:rounded-[bento] shadow-premium overflow-hidden flex flex-col"
      >
        {/* --- HEADER TERMINAL --- */}
        <div className="px-8 h-20 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-premium">
              <Layout size={20} strokeWidth={2.5} />
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                Service Configurator
              </p>
              <h2 className="text-sm font-bold text-primary truncate max-w-[300px] uppercase tracking-tight">
                {currentTitle || "Unnamed Strategy"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-400 hover:text-primary font-bold text-[11px] uppercase tracking-widest transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isProcessing || uploading}
              className="btn-primary !px-10 !py-3 !text-[11px] flex items-center gap-3 shadow-accent-glow"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Sync to Catalog
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/30">
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="flex-1 overflow-y-auto p-6 md:p-16 lg:p-20 bg-white no-scrollbar">
            <div className="max-w-[800px] mx-auto space-y-12">
              {/* Product Headline */}
              <div className="space-y-6">
                <input
                  {...register("title", { required: true })}
                  placeholder="Service Name (e.g. Meta Ads Scaler)"
                  className="w-full text-4xl md:text-5xl font-bold text-primary placeholder:text-slate-100 border-none focus:ring-0 p-0 leading-tight outline-none tracking-tighter"
                />
                <div className="h-1.5 w-24 bg-accent rounded-full opacity-80" />
              </div>

              {/* Description Canvas */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
                  <FileText size={14} className="text-accent" /> Offer
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Elaborate on how this service transforms business ROI..."
                  className="w-full text-lg text-slate-600 font-medium leading-relaxed border-none focus:ring-0 p-0 min-h-[160px] resize-none outline-none placeholder:text-slate-200"
                />
              </div>

              {/* Value Proposition Grid (Benefits) */}
              <div className="space-y-8 pt-10 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                    Value Proposition
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:opacity-70 transition-opacity"
                  >
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={field.id}
                      className="flex gap-3 group relative"
                    >
                      <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                          <Zap size={14} />
                        </div>
                        <input
                          {...register(`benefit_list.${index}.value` as const)}
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-sm text-primary transition-all shadow-sm group-hover:shadow-md"
                          placeholder="e.g. Comprehensive Market Audit"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- SIDEBAR CONFIG (RIGHT) --- */}
          <aside className="w-full lg:w-[400px] bg-slate-50 border-l border-slate-100 overflow-y-auto p-10 space-y-10 no-scrollbar">
            {/* Core Metrics */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                <Settings size={16} className="text-accent" /> Core Logistics
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                    Industry Taxonomy
                  </label>
                  <div className="relative">
                    <select
                      {...register("category")}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-primary outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Ads">Ads Management</option>
                      <option value="SEO">SEO Search Engine</option>
                      <option value="Web">Web Development</option>
                      <option value="Property">Property Listing</option>
                    </select>
                    <ChevronRight
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                    Baseline Valuation (Rp)
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-focus-within:bg-emerald-500 group-focus-within:text-white transition-all">
                      <DollarSign size={16} />
                    </div>
                    <input
                      type="number"
                      {...register("price_start")}
                      className="w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-primary outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Branding */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                <ImageIcon size={16} className="text-accent" /> Asset Thumbnail
              </div>

              <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200/60 shadow-sm group">
                <div className="aspect-video w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 relative overflow-hidden transition-all group-hover:border-accent/30">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setValue("image_url", "")}
                          className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                          Replace Visual
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
                        <UploadCloud size={28} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-8 leading-relaxed">
                        Upload Hero Image
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
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-accent" size={32} />
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                        Optimizing...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Placement & Status */}
            <div className="p-8 bg-primary rounded-[2.5rem] text-white space-y-6 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={40} />
              </div>
              <div className="flex flex-col gap-4 relative z-10">
                <label className="flex items-center justify-between cursor-pointer group p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Active Listing
                  </span>
                  <input
                    type="checkbox"
                    {...register("is_active")}
                    className="w-5 h-5 accent-accent"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Featured Highlight
                  </span>
                  <input
                    type="checkbox"
                    {...register("is_featured")}
                    className="w-5 h-5 accent-accent"
                  />
                </label>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
