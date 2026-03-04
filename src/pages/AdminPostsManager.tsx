// src/pages/AdminPostsManager.tsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import {
  Plus,
  Search,
  FileText,
  ExternalLink,
  Trash2,
  Edit3,
  Calendar,
  Loader2,
} from "lucide-react"; // Pastikan menggunakan lucide-react
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import BlogFormModal from "../components/BlogFormModal";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
}

export default function AdminPostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounce = setTimeout(fetchPosts, 500);
    return () => clearTimeout(debounce);
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}" secara permanen?`)) return;
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Artikel dihapus");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error("Gagal menghapus artikel");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-[#0F1F4A] tracking-tighter">
            Content <span className="text-[#FF3B3B]">Marketing</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Edukasi klien & Optimasi SEO OmzetNaik.id
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPost(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#0F1F4A] text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all"
        >
          <Plus size={20} className="text-[#FF3B3B]" /> Tulis Artikel Baru
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF3B3B] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Cari judul artikel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#0F1F4A]/5 transition-all"
        />
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading && posts.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="animate-spin text-[#FF3B3B]" size={32} />
              <p className="font-black uppercase tracking-widest text-[10px]">
                Menyinkronkan Database...
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={post.id}
                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img
                    src={
                      post.image_url ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    alt={post.title}
                  />
                  <div className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur rounded-xl text-[#0F1F4A] shadow-sm">
                    <FileText size={18} />
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Calendar size={12} />{" "}
                      {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <h3 className="font-heading font-extrabold text-[#0F1F4A] text-lg mb-6 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 text-slate-400 hover:text-[#0F1F4A] hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2.5 text-slate-400 hover:text-[#FF3B3B] hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-soft text-[#0F1F4A] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0F1F4A] hover:text-white transition-all shadow-sm"
                    >
                      View <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <BlogFormModal
            post={editingPost}
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);
              fetchPosts();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
