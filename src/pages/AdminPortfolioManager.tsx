// src/pages/AdminPortfolioManager.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Briefcase,
  Sparkles,
  LayoutGrid,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import PortfolioFormModal from "../components/PortfolioFormModal";

export default function AdminPortfolioManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Gagal memuat data");
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus case study ini secara permanen?")) return;

    const { error } = await supabase.from("portfolios").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus");
    } else {
      toast.success("Case study berhasil dihapus");
      fetchPortfolio();
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Case Study <span className="text-accent italic">Gallery.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Pamerkan hasil kerja nyata dan bukti konversi agensi.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="btn-primary !w-full md:!w-auto flex items-center justify-center gap-3 shadow-accent-glow active:scale-95"
        >
          <Plus size={20} />
          Publish Project
        </button>
      </div>

      {/* --- STATS MINI BANNER --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <LayoutGrid size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Total Projects
            </p>
            <p className="text-lg font-bold text-primary">{items.length}</p>
          </div>
        </div>
        <div className="w-px h-10 bg-slate-100 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Status
            </p>
            <p className="text-lg font-bold text-emerald-600 tracking-tight">
              Live on Site
            </p>
          </div>
        </div>
      </div>

      {/* --- ASSET GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Syncing Assets...
            </p>
          </div>
        ) : items.length > 0 ? (
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="group bg-white rounded-[bento] border border-slate-100 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 flex flex-col"
              >
                {/* Image Area with Actions Overlay */}
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                      <ImageIcon size={48} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase mt-2">
                        No Preview
                      </p>
                    </div>
                  )}

                  {/* Action Overlay (Vercel Style) */}
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                      title="Edit Project"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-12 h-12 bg-white text-rose-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                      title="Delete Project"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-primary text-[9px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-7 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-primary mb-6 leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2 tracking-tight">
                    {item.title}
                  </h3>

                  {/* Results Snapshot */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Impact
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {item.metric_1_val || "—"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Reach
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {item.metric_3_val || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-40 text-center bg-white rounded-[bento] border-2 border-dashed border-slate-100">
            <Briefcase
              size={48}
              className="mx-auto text-slate-100 mb-4"
              strokeWidth={1}
            />
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
              Belum ada case study yang dipublish.
            </p>
          </div>
        )}
      </div>

      {/* --- MODAL LAYER --- */}
      {isModalOpen && (
        <PortfolioFormModal
          project={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            fetchPortfolio();
          }}
        />
      )}
    </div>
  );
}
