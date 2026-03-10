// src/pages/AdminServicesManager.tsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Tag,
  BarChart3,
  Search,
  LayoutGrid,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ServiceFormModal from "../components/ServiceFormModal";

export default function AdminServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error("Gagal sinkronisasi data layanan");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounce = setTimeout(fetchServices, 500);
    return () => clearTimeout(debounce);
  }, [fetchServices]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(
        `Layanan ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`,
      );
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_active: !currentStatus } : s,
        ),
      );
    } catch (error: any) {
      toast.error("Gagal memperbarui status operasional");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(`Hapus layanan "${title}"? Langkah ini tidak dapat dibatalkan.`)
    )
      return;
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      toast.success("Layanan berhasil dihapus dari katalog");
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      toast.error("Gagal menghapus layanan");
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Service <span className="text-accent italic">Catalog.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Kelola paket strategi digital dan optimasi konversi OmzetNaik.id
          </p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="btn-primary !w-full md:!w-auto flex items-center justify-center gap-3 shadow-accent-glow active:scale-95"
        >
          <Plus size={20} /> Tambah Layanan Baru
        </button>
      </div>

      {/* --- SUMMARY & SEARCH BAR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari spesialisasi atau paket jasa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-700"
          />
        </div>
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/5 rounded-lg text-accent">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Active Services
            </span>
          </div>
          <span className="text-lg font-bold text-primary">
            {services.filter((s) => s.is_active).length} / {services.length}
          </span>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-[bento] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Service Offering
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Category Tag
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Base Valuation
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  System Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-accent" size={32} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Updating Catalog...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : services.length > 0 ? (
                services.map((s) => (
                  <tr
                    key={s.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 group-hover:border-primary/20 transition-all shadow-sm">
                          {s.image_url ? (
                            <img
                              src={s.image_url}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              alt=""
                            />
                          ) : (
                            <BarChart3 size={20} className="text-slate-400" />
                          )}
                        </div>
                        <span className="font-bold text-primary text-base tracking-tight">
                          {s.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider border border-slate-200/50">
                        <Tag size={12} className="text-accent" /> {s.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-primary text-sm tracking-tight">
                        Rp {s.price_start?.toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => toggleStatus(s.id, s.is_active)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] transition-all hover:ring-2 hover:ring-slate-100 ${
                          s.is_active
                            ? "bg-emerald-50 text-emerald-600 shadow-sm"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${s.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                        />
                        {s.is_active ? "OPERATIONAL" : "ARCHIVED"}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingService(s);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 bg-slate-100 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.title)}
                          className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-32 text-center text-slate-400 font-bold uppercase tracking-widest text-xs"
                  >
                    No services active in the terminal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      <AnimatePresence>
        {isModalOpen && (
          <ServiceFormModal
            service={editingService}
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);
              fetchServices();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
