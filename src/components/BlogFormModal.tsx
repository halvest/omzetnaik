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
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import RichTextEditor from "./RichTextEditor"; // Import komponen Tiptap

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
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName);

      setValue("image_url", publicUrl);
      toast.success("Gambar cover berhasil diperbarui");
    } catch (error: any) {
      toast.error("Gagal upload gambar");
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
      toast.success("Artikel berhasil diterbitkan");
      onSave();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1F4A]/40 backdrop-blur-sm p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#F8FAFC] w-full max-w-[95vw] h-full sm:h-[92vh] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Bar (WordPress Style) */}
        <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#FF3B3B] text-white rounded-xl shadow-lg shadow-red-600/20">
              <Type size={18} strokeWidth={3} />
            </div>
            <h2 className="font-heading font-extrabold text-[#0F1F4A] truncate max-w-[200px] md:max-w-md">
              {currentTitle || "Draft Artikel Baru"}
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
              disabled={isProcessing}
              className="px-8 py-3 bg-[#0F1F4A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Publish Artikel
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT SIDE: Content Editor */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-10">
              {/* Title Editor */}
              <div className="space-y-4">
                <input
                  {...register("title", { required: true })}
                  placeholder="Masukkan Judul yang Menjual..."
                  className="w-full text-4xl md:text-5xl font-heading font-extrabold text-[#0F1F4A] placeholder:text-slate-100 border-none focus:ring-0 p-0 leading-tight outline-none"
                />
                <div className="h-1.5 w-24 bg-[#FF3B3B] rounded-full" />
              </div>

              {/* Rich Text Editor Integration */}
              <div className="space-y-4 min-h-[500px]">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <FileText size={14} /> Konten Utama
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

          {/* RIGHT SIDE: Sidebar Panel */}
          <aside className="w-full lg:w-[380px] bg-[#F8FAFC] border-l border-slate-200 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* SEO & Meta Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F1F4A] text-[10px] font-black uppercase tracking-widest">
                <Settings size={14} className="text-[#FF3B3B]" /> Pengaturan
                Post
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    Kategori
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0F1F4A] outline-none focus:ring-2 focus:ring-[#0F1F4A]/5"
                  >
                    <option value="Marketing">Marketing Strategy</option>
                    <option value="Properti">Property News</option>
                    <option value="Investasi">Investment Guide</option>
                    <option value="Tips">Agency Updates</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    Snippet Ringkasan
                  </label>
                  <textarea
                    {...register("excerpt")}
                    rows={3}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-[#0F1F4A]/5 resize-none"
                    placeholder="Teks ini akan tampil di halaman depan blog..."
                  />
                </div>
              </div>
            </div>

            {/* Cover Image Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F1F4A] text-[10px] font-black uppercase tracking-widest">
                <ImageIcon size={14} className="text-[#FF3B3B]" /> Cover Utama
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                <div className="aspect-video w-full bg-slate-100 rounded-2xl overflow-hidden relative group">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        className="w-full h-full object-cover"
                        alt="Featured"
                      />
                      <button
                        type="button"
                        onClick={() => setValue("image_url", "")}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center font-bold text-xs"
                      >
                        Hapus & Ganti
                      </button>
                    </>
                  ) : (
                    <label className="inset-0 absolute flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-all">
                      <UploadCloud size={32} className="text-slate-300 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase text-center px-4">
                        Tarik file atau klik untuk upload cover
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
                <input
                  type="hidden"
                  {...register("image_url", { required: true })}
                />
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
