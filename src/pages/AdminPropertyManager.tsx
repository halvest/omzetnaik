// src/pages/AdminPropertyManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ArrowUpRight,
  Filter,
  RefreshCw,
  Star,
} from "lucide-react";
import { formatHarga } from "../utils/idr";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Interface disesuaikan dengan skema database terbaru
interface PropertyAsset {
  id: string;
  title: string;
  slug: string;
  price: number;
  listing_type: "jual" | "sewa";
  property_type: string;
  city: string;
  district: string;
  status: "active" | "pending" | "sold" | "inactive";
  is_featured: boolean;
  user_id?: string;
  profiles?: { name: string };
}

export default function AdminPropertyManager() {
  const [properties, setProperties] = useState<PropertyAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyAsset | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  // OPTIMASI: Fetching dengan Explicit Join 'profiles!user_id' untuk fix schema cache error
  const fetchProperties = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      else setIsRefreshing(true);

      try {
        let query = supabase
          .from("properties")
          .select(
            `
            *,
            profiles!user_id ( name )
          `,
          )
          .order("created_at", { ascending: false });

        if (searchTerm.trim()) {
          query = query.or(
            `title.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,district.ilike.%${searchTerm}%`,
          );
        }

        const { data, error } = await query;
        if (error) throw error;
        setProperties((data as PropertyAsset[]) || []);
      } catch (error: any) {
        // Jika masih error profiles, fallback ke query tanpa join agar dashboard tetap jalan
        if (error.message.includes("profiles")) {
          const { data } = await supabase
            .from("properties")
            .select("*")
            .order("created_at", { ascending: false });
          setProperties((data as PropertyAsset[]) || []);
        } else {
          toast.error(`Database Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchProperties(), 400);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus listing secara permanen?")) return;

    const loadingToast = toast.loading("Menghapus aset...");
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
      toast.success("Listing dihapus", { id: loadingToast });
      fetchProperties(true);
    } catch (error: any) {
      toast.error(`Gagal: ${error.message}`, { id: loadingToast });
    }
  };

  const stats = useMemo(
    () => ({
      total: properties.length,
      active: properties.filter((p) => p.status === "active").length,
      featured: properties.filter((p) => p.is_featured).length,
    }),
    [properties],
  );

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Asset <span className="text-accent italic">Inventory.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Terminal Manajemen Properti OmzetNaik.id
          </p>
        </motion.div>

        <div className="flex gap-3">
          <button
            onClick={() => fetchProperties(true)}
            className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={() => {
              setEditingProperty(null);
              setIsModalOpen(true);
            }}
            className="flex-1 md:flex-none px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Listing
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Assets"
          value={`${stats.total} Units`}
          icon={<Home size={22} />}
          variant="primary"
        />
        <StatCard
          label="Live on Market"
          value={`${stats.active} Units`}
          icon={<CheckCircle2 size={22} />}
          variant="emerald"
        />
        <StatCard
          label="Featured Listing"
          value={`${stats.featured} Units`}
          icon={<Star size={22} />}
          variant="accent"
        />
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Cari berdasarkan judul, kota, atau wilayah..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Property Information
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Category
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Financials
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Visibility
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Commands
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && properties.length === 0 ? (
                <LoadingState />
              ) : properties.length === 0 ? (
                <EmptyState />
              ) : (
                properties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="group hover:bg-slate-50/80 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold text-primary text-base tracking-tight mb-1 group-hover:text-accent transition-colors">
                            {prop.title}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={12} className="text-accent" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {prop.district}, {prop.city}
                            </span>
                          </div>
                        </div>
                        {prop.is_featured && (
                          <div className="px-2 py-1 bg-amber-100 text-amber-600 rounded-md shadow-sm">
                            <Star size={12} fill="currentColor" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-tighter">
                      {prop.property_type}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-primary text-sm tracking-tight">
                        {formatHarga(prop.price)}
                      </p>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Pricing Model: {prop.listing_type}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          prop.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${prop.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                        />
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingProperty(prop);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 bg-white text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm border border-slate-100"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-2.5 bg-white text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a
                          href={`/properti/${prop.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm border border-slate-100"
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

      <AnimatePresence>
        {isModalOpen && (
          <PropertyFormModal
            villa={editingProperty}
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);
              fetchProperties(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon, variant }: any) => {
  const styles: any = {
    primary: "bg-primary text-white",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-primary/20 transition-all">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border transition-transform group-hover:scale-110 ${styles[variant]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p
          className={`text-2xl font-bold ${variant === "primary" ? "text-primary" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <tr>
    <td colSpan={5} className="py-40">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Syncing Asset Database...
        </p>
      </div>
    </td>
  </tr>
);

const EmptyState = () => (
  <tr>
    <td colSpan={5} className="py-40 text-center">
      <LayoutGrid size={48} className="mx-auto text-slate-100 mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
        No assets found in terminal.
      </p>
    </td>
  </tr>
);
