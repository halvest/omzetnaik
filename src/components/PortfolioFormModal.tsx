// src/components/PortfolioFormModal.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import { X, Save, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PortfolioFormModal({ project, onClose, onSave }: any) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [uploading, setUploading] = useState(false);
  const currentImage = watch("image_url");

  useEffect(() => {
    if (project) reset(project);
    else
      reset({
        category: "Marketing",
        metric_1_label: "ROAS",
        metric_2_label: "Leads",
      });
  }, [project, reset]);

  const handleUpload = async (e: any) => {
    setUploading(true);
    const file = e.target.files[0];
    const path = `portfolio/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("property-images")
      .upload(path, file);
    if (!error) {
      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(path);
      setValue("image_url", data.publicUrl);
      toast.success("Gambar diunggah");
    }
    setUploading(false);
  };

  const onSubmit = async (data: any) => {
    const slug = data.slug || data.title.toLowerCase().replace(/ /g, "-");
    const { error } = project?.id
      ? await supabase
          .from("portfolios")
          .update({ ...data, slug })
          .eq("id", project.id)
      : await supabase.from("portfolios").insert([{ ...data, slug }]);

    if (!error) {
      toast.success("Tersimpan");
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1F4A]/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-extrabold text-[#0F1F4A] uppercase tracking-tighter">
            Manage Case Study
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                {...register("title", { required: true })}
                placeholder="Judul Project"
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-[#0F1F4A]"
              />
              <textarea
                {...register("description")}
                placeholder="Ringkasan Singkat"
                className="w-full p-4 bg-slate-50 rounded-2xl min-h-[100px] border-none outline-none"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    {...register("metric_1_val")}
                    placeholder="150%"
                    className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold"
                  />
                  <input
                    {...register("metric_1_label")}
                    placeholder="ROAS"
                    className="w-full mt-1 text-[8px] uppercase font-black text-center"
                  />
                </div>
                <div>
                  <input
                    {...register("metric_2_val")}
                    placeholder="1.2k"
                    className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold"
                  />
                  <input
                    {...register("metric_2_label")}
                    placeholder="Leads"
                    className="w-full mt-1 text-[8px] uppercase font-black text-center"
                  />
                </div>
                <div>
                  <input
                    {...register("metric_3_val")}
                    placeholder="2.4M"
                    className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold"
                  />
                  <input
                    {...register("metric_3_label")}
                    placeholder="Reach"
                    className="w-full mt-1 text-[8px] uppercase font-black text-center"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <label className="cursor-pointer text-center">
                    <UploadCloud size={32} className="mx-auto text-slate-300" />
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Upload Project Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleUpload}
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
                {...register("category")}
                placeholder="Kategori (Ads, SEO, dll)"
                className="w-full p-4 bg-slate-50 rounded-2xl text-sm"
              />
              <input
                {...register("project_url")}
                placeholder="Link Project (URL)"
                className="w-full p-4 bg-slate-50 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              className="px-12 py-4 bg-[#0F1F4A] text-white rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Simpan Portofolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
