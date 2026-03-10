// src/pages/AdminPropertyManager.tsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import PropertyFormModal from "../components/PropertyFormModal";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  Home,
  Loader2,
  LayoutGrid,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { formatHarga } from "../utils/idr";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPropertyManager() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("properties")
        .select(`*, profiles (name)`)
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        query = query.or(
          `title.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,district.ilike.%${searchTerm}%`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error(`Gagal memuat data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (
      !confirm("Apakah Anda yakin ingin menghapus listing ini secara permanen?")
    )
      return;
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
      toast.success("Listing berhasil dihapus");
      fetchProperties();
    } catch (error: any) {
      toast.error(`Gagal menghapus: ${error.message}`);
    }
  };

  const stats = {
    total: properties.length,
    active: properties.filter((p) => p.status === "active").length,
    sold: properties.filter((p) => p.status === "sold").length,
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Inventory <span className="text-accent italic">Terminal.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Kelola listing properti eksklusif dan status ketersediaan unit.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProperty(null);
            setIsModalOpen(true);
          }}
          className="btn-primary !w-full md:!w-auto flex items-center justify-center gap-3 shadow-accent-glow active:scale-95"
        >
          <Plus size={20} /> Tambah Listing Baru
        </button>
      </div>

      {/* --- BENTO STATS SUMMARY --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-premium">
            <Home size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Total Inventory
            </p>
            <p className="text-2xl font-bold text-primary">
              {stats.total} Units
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Status Active
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.active} Units
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
            <LayoutGrid size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Sold / Inactive
            </p>
            <p className="text-2xl font-bold text-slate-400">
              {stats.sold} Units
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTROL BAR --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari properti berdasarkan judul, kota, atau area..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-primary font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} className="text-slate-400" /> Advanced Filter
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-[bento] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Property Details
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Asset Type
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Valuation
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Market Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-accent" size={32} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Syncing Property Database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                      No assets found in terminal.
                    </p>
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-primary text-base tracking-tight mb-1">
                          {prop.title}
                        </p>
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={12} className="text-accent" />
                          <span className="text-[11px] font-medium uppercase tracking-wider italic">
                            {prop.district}, {prop.city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">
                          {prop.property_type}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter w-fit ${
                            prop.listing_type === "jual"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          For {prop.listing_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-primary text-sm tracking-tight">
                        {formatHarga(prop.price)}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          prop.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${prop.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                        />
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingProperty(prop);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 bg-slate-100 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Edit Listing"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Delete Listing"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a
                          href={`/properti/${prop.slug}`}
                          target="_blank"
                          className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm"
                        >
                          <ArrowUpRight size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL LAYER --- */}
      <AnimatePresence>
        {isModalOpen && (
          <PropertyFormModal
            villa={editingProperty}
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);
              fetchProperties();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
