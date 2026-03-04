// src/pages/AdminServicesManager.tsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Tag,
  BarChart3,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ServiceFormModal from "../components/ServiceFormModal";

export default function AdminServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Modal
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
      toast.error("Gagal mengambil data layanan: " + error.message);
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
      toast.error("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(`Hapus layanan "${title}"? Data ini tidak dapat dikembalikan.`)
    )
      return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;

      toast.success("Layanan berhasil dihapus");
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      toast.error("Gagal menghapus layanan");
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-[#0F1F4A] tracking-tighter">
            Layanan <span className="text-[#FF3B3B]">Agency</span>
          </h1>
          <p className="text-slate-500 text-sm font-sans mt-1">
            Kelola paket strategi dan optimasi OmzetNaik.id
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#0F1F4A] text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-black transition-all active:scale-95"
        >
          <Plus size={20} className="text-[#FF3B3B]" /> Tambah Layanan Baru
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-md group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF3B3B] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Cari nama layanan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#0F1F4A]/5 transition-all font-medium"
        />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-[#F5F7FB] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Layanan
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Kategori
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Mulai Dari
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2
                        className="animate-spin text-[#FF3B3B]"
                        size={32}
                      />
                      <p className="font-bold uppercase tracking-widest text-[10px]">
                        Menyinkronkan Layanan...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : services.length > 0 ? (
                services.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-[#F5F7FB]/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-[#0F1F4A]">
                          {s.image_url ? (
                            <img
                              src={s.image_url}
                              className="w-full h-full object-cover rounded-xl"
                              alt=""
                            />
                          ) : (
                            <BarChart3 size={18} />
                          )}
                        </div>
                        <span className="font-bold text-[#0F1F4A]">
                          {s.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Tag size={14} className="text-slate-300" />
                        {s.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-[#0F1F4A] text-sm">
                      Rp {s.price_start?.toLocaleString("id-ID")}
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => toggleStatus(s.id, s.is_active)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${
                          s.is_active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {s.is_active ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {s.is_active ? "AKTIF" : "OFF"}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-slate-400 hover:text-[#0F1F4A] hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.title)}
                          className="p-2 text-slate-400 hover:text-[#FF3B3B] hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs"
                  >
                    Tidak ada layanan ditemukan.
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
