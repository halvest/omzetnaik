// src/components/PortfolioFormModal.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import {
  X,
  Save,
  UploadCloud,
  Loader2,
  TrendingUp,
  Link as LinkIcon,
  Tag,
  FileText,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Props {
  project: any;
  onClose: () => void;
  onSave: () => void;
}

export default function PortfolioFormModal({
  project,
  onClose,
  onSave,
}: Props) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [uploading, setUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentImage = watch("image_url");
  const currentTitle = watch("title");

  useEffect(() => {
    if (project) reset(project);
    else
      reset({
        category: "Meta Ads",
        metric_1_label: "ROAS Increase",
        metric_2_label: "New Leads",
        metric_3_label: "Total Reach",
        is_featured: false,
      });
  }, [project, reset]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `portfolio/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName);

      setValue("image_url", publicUrl);
      toast.success("Project image uploaded");
    } catch (error: any) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsProcessing(true);
    try {
      const slug =
        data.slug ||
        data.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");

      const payload = { ...data, slug, updated_at: new Date().toISOString() };

      const { error } = project?.id
        ? await supabase.from("portfolios").update(payload).eq("id", project.id)
        : await supabase.from("portfolios").insert([payload]);

      if (error) throw error;

      toast.success("Case study saved successfully");
      onSave();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 backdrop-blur-md p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[bento] overflow-hidden flex flex-col shadow-premium"
      >
        {/* --- MODAL HEADER --- */}
        <div className="px-8 h-20 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <Sparkles size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                Portfolio Studio
              </p>
              <h2 className="text-sm font-bold text-primary truncate max-w-[200px] md:max-w-md uppercase tracking-tight">
                {currentTitle || "New Case Study"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto no-scrollbar"
        >
          <div className="p-8 lg:p-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* LEFT COLUMN: BASIC INFO */}
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                    <FileText size={16} className="text-accent" /> Project
                    Essence
                  </div>
                  <div className="space-y-4">
                    <input
                      {...register("title", { required: true })}
                      placeholder="Project Title (e.g. Sasmaya Residence Meta Ads)"
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-primary text-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                    />
                    <textarea
                      {...register("description", { required: true })}
                      placeholder="Brief overview of the challenge and solution..."
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl min-h-[120px] text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* DYNAMIC METRICS SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                    <TrendingUp size={16} className="text-accent" /> Impact
                    Performance
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-4"
                      >
                        <input
                          {...register(`metric_${num}_val`)}
                          placeholder={
                            num === 1 ? "150%" : num === 2 ? "1.2k" : "2.4M"
                          }
                          className="w-full text-center text-2xl font-bold text-primary border-none p-0 bg-transparent outline-none focus:text-accent transition-colors"
                        />
                        <input
                          {...register(`metric_${num}_label`)}
                          placeholder="Label"
                          className="w-full text-center text-[9px] font-bold uppercase tracking-widest text-slate-400 border-none p-0 bg-transparent outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: ASSETS & TAGS */}
              <div className="lg:col-span-5 space-y-10">
                {/* Visual Asset */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                    <UploadCloud size={16} className="text-accent" /> Cover
                    Visual
                  </div>
                  <div className="aspect-[4/3] bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:border-accent/30">
                    {currentImage ? (
                      <>
                        <img
                          src={currentImage}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setValue("image_url", "")}
                            className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                          >
                            Change Image
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="inset-0 absolute flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                        <UploadCloud
                          size={32}
                          className="text-slate-300 mb-3"
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-8 leading-relaxed">
                          Click to upload <br /> project thumbnail
                        </span>
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
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Loader2
                          className="animate-spin text-accent"
                          size={32}
                        />
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                          Processing...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categorization */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                    <Tag size={16} className="text-accent" /> Classification
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <select
                        {...register("category")}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-primary outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Meta Ads">Meta Ads Campaign</option>
                        <option value="Google Ads">Google Search Ads</option>
                        <option value="Web Development">
                          Premium Development
                        </option>
                        <option value="SEO">SEO Strategy</option>
                        <option value="Social Media">
                          Social Media Growth
                        </option>
                      </select>
                      <ChevronRight
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                      />
                    </div>
                    <div className="relative group">
                      <LinkIcon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent"
                      />
                      <input
                        {...register("project_url")}
                        placeholder="Live Project URL (optional)"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL WIDTH CONTENT (Case Study Detail) */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                <ChevronRight size={16} className="text-accent" /> Strategic
                Narrative
              </div>
              <textarea
                {...register("content")}
                placeholder="Tell the full story: Strategy, Execution, and Detailed Results..."
                className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] min-h-[250px] text-base font-medium text-slate-600 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* --- STICKY FOOTER --- */}
          <div className="px-8 py-6 bg-slate-50/50 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-20">
            <p className="text-[10px] font-medium text-slate-400 italic hidden sm:block">
              All changes are automatically prepared for live deployment.
            </p>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-8 py-3.5 text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-12 py-3.5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-premium hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Deploy Case Study
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
