// src/pages/AdminPropertyManager.tsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import PropertyFormModal from "../components/PropertyFormModal";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Home,
  Loader2,
} from "lucide-react";
import { formatHarga } from "../utils/idr";
import { toast } from "react-hot-toast";

export default function AdminPropertyManager() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      // Mengambil data properti beserta info author dari tabel profiles
      let query = supabase
        .from("properties")
        .select(
          `
          *,
          profiles (name)
        `,
        )
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        // Optimasi: Gunakan ilike pada kolom yang relevan
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

  // Efek untuk fetch data dengan mekanisme Debounce sederhana
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProperties();
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => clearTimeout(handler);
  }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus listing ini?")) return;

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;

      toast.success("Properti berhasil dihapus");
      fetchProperties();
    } catch (error: any) {
      toast.error(`Gagal menghapus: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-primary">
            Manajemen Listing
          </h1>
          <p className="text-slate-500 text-sm font-sans">
            Kelola database properti jual & sewa OmzetNaik.id
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProperty(null);
            setIsModalOpen(true);
          }}
          className="btn-primary py-3 px-6 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 flex items-center gap-2 hover:bg-accent/90 transition-all"
        >
          <Plus size={20} /> Tambah Listing Baru
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, kota, atau kecamatan..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-primary text-white p-3 rounded-2xl flex items-center justify-center gap-3 shadow-md">
          <Home size={20} className="text-accent" />
          <span className="font-bold">{properties.length} Total Unit</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-neutral-soft border-b border-border text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Info Properti</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 className="animate-spin" size={32} />
                      <p className="font-bold uppercase tracking-widest text-xs">
                        Menyelaraskan data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    Tidak ada properti ditemukan.
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="hover:bg-neutral-soft/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary">{prop.title}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 uppercase font-bold">
                        <MapPin size={10} /> {prop.district}, {prop.city}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-secondary uppercase">
                          {prop.property_type}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md w-fit uppercase ${
                            prop.listing_type === "jual"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {prop.listing_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary text-sm">
                      {formatHarga(prop.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                          prop.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProperty(prop);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Edit Properti"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 text-slate-400 hover:text-accent transition-colors"
                        title="Hapus Properti"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}
