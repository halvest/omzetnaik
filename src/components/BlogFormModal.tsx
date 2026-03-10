// src/components/BlogFormModal.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "../utils/supabase";
import {
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Settings,
  UploadCloud,
  Type,
  FileText,
  ChevronRight,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";

interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
}

interface Props {
  post: Post | null;
  onClose: () => void;
  onSave: () => void;
}

const slugify = (text: string) =>
  text
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") || "";

export default function BlogFormModal({ post, onClose, onSave }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, control } =
    useForm<Post>();

  const currentTitle = watch("title");
  const currentImage = watch("image_url");

  useEffect(() => {
    if (post) reset(post);
    else
      reset({
        category: "Marketing",
        title: "",
        content: "",
        excerpt: "",
        image_url: "",
      });
  }, [post, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `blog/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images") // Pastikan bucket ini sesuai
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName);

      setValue("image_url", publicUrl);
      toast.success("Cover image optimized and uploaded");
    } catch (error: any) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: Post) => {
    setIsProcessing(true);
    try {
      const payload = {
        ...data,
        slug: data.slug || slugify(data.title),
        updated_at: new Date().toISOString(),
      };

      const { error } = post?.id
        ? await supabase.from("posts").update(payload).eq("id", post.id)
        : await supabase.from("posts").insert([payload]);

      if (error) throw error;

      toast.success(
        post?.id ? "Changes saved" : "Article published successfully",
      );
      onSave();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 backdrop-blur-md p-0 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-[1400px] h-full sm:h-[94vh] sm:rounded-[bento] shadow-premium overflow-hidden flex flex-col"
      >
        {/* --- HEADER TERMINAL --- */}
        <div className="px-8 h-20 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-accent-glow">
              <Type size={20} strokeWidth={2.5} />
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                Editorial Mode
              </p>
              <h2 className="text-sm font-bold text-primary truncate max-w-[300px]">
                {currentTitle || "Untitled Draft"}
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
              disabled={isProcessing}
              className="btn-primary !px-8 !py-3 !text-[11px] flex items-center gap-3 shadow-accent-glow"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Globe size={16} />
              )}
              Publish Content
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/30">
          {/* --- LEFT SIDE: THE CANVAS --- */}
          <div className="flex-1 overflow-y-auto p-6 md:p-16 lg:p-24 bg-white no-scrollbar">
            <div className="max-w-[800px] mx-auto space-y-12">
              {/* Title Section */}
              <div className="space-y-6">
                <textarea
                  {...register("title", { required: true })}
                  placeholder="The Headline of Impact..."
                  rows={2}
                  className="w-full text-4xl md:text-6xl font-bold text-primary placeholder:text-slate-100 border-none focus:ring-0 p-0 leading-[1.1] outline-none resize-none tracking-tighter"
                />
                <div className="h-1.5 w-24 bg-accent rounded-full opacity-80" />
              </div>

              {/* Editor Integration */}
              <div className="space-y-6 min-h-[600px]">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    Story Start
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <Controller
                  name="content"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: SETTINGS PANEL --- */}
          <aside className="w-full lg:w-[400px] bg-slate-50 border-l border-slate-100 overflow-y-auto p-10 space-y-10 no-scrollbar">
            {/* SEO & Classification */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                <Settings size={16} className="text-accent" /> Article Config
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                    Category Taxonomy
                  </label>
                  <div className="relative">
                    <select
                      {...register("category")}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-primary outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Marketing">Marketing Strategy</option>
                      <option value="Properti">Property News</option>
                      <option value="Investasi">Investment Guide</option>
                      <option value="Tips">Agency Updates</option>
                    </select>
                    <ChevronRight
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                    Search Snippet (Excerpt)
                  </label>
                  <textarea
                    {...register("excerpt")}
                    rows={4}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed"
                    placeholder="Brief summary for social media and search results..."
                  />
                </div>
              </div>
            </div>

            {/* Visual Branding (Cover) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                <ImageIcon size={16} className="text-accent" /> Visual Asset
              </div>

              <div className="bg-white p-2 rounded-[2rem] border border-slate-200/60 shadow-sm group">
                <div className="aspect-[16/10] w-full bg-slate-50 rounded-[1.5rem] overflow-hidden relative border border-dashed border-slate-200 transition-all group-hover:border-accent/30">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Featured"
                      />
                      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setValue("image_url", "")}
                          className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                          Change Cover
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="inset-0 absolute flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
                        <UploadCloud size={28} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-8">
                        Upload Featured Image
                      </span>
                      <p className="text-[9px] text-slate-300 mt-2 font-medium">
                        Recommended: 1600 x 1000px
                      </p>
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

            <input
              type="hidden"
              {...register("image_url", { required: true })}
            />
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
