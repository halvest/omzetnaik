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
} from "lucide-react";
import { toast } from "react-hot-toast";
import PortfolioFormModal from "../components/PortfolioFormModal";

export default function AdminPortfolioManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("portfolios")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus case study ini?")) return;
    const { error } = await supabase.from("portfolios").delete().eq("id", id);
    if (!error) {
      toast.success("Berhasil dihapus");
      fetchPortfolio();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-[#0F1F4A]">
            Case Studies
          </h1>
          <p className="text-slate-500 text-sm">
            Pamerkan hasil kerja nyata OmzetNaik.id
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="bg-[#0F1F4A] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          <Plus size={18} className="text-[#FF3B3B]" /> Project Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-[#FF3B3B]" />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-video relative">
                <img
                  src={item.image_url}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-white text-[#0F1F4A] rounded-xl"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-500 text-white rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <span className="text-[9px] font-black uppercase text-[#FF3B3B] tracking-widest">
                  {item.category}
                </span>
                <h3 className="font-bold text-[#0F1F4A] mt-1 line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))
        )}
      </div>

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
