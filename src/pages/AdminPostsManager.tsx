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
  Sparkles,
  LayoutGrid,
  Image as ImageIcon,
} from "lucide-react";
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
      toast.error("Gagal sinkronisasi data konten");
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
      toast.success("Artikel berhasil dihapus");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error("Gagal menghapus artikel");
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Content <span className="text-accent italic">Marketing.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Edukasi klien & Optimasi SEO Authority OmzetNaik.id
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPost(null);
            setIsModalOpen(true);
          }}
          className="btn-primary !w-full md:!w-auto flex items-center justify-center gap-3 shadow-accent-glow active:scale-95"
        >
          <Plus size={20} />
          Tulis Artikel Baru
        </button>
      </div>

      {/* --- QUICK STATS & SEARCH BAR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari judul artikel atau kata kunci SEO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-700"
          />
        </div>

        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <LayoutGrid size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Posts
            </span>
          </div>
          <span className="text-lg font-bold text-primary">{posts.length}</span>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading && posts.length === 0 ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin text-accent" size={40} />
              <p className="font-bold uppercase tracking-[0.3em] text-[10px]">
                Menyinkronkan Portal Edukasi...
              </p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: [0.2, 0, 0, 1],
                }}
                key={post.id}
                className="group bg-white rounded-[bento] border border-slate-100 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 flex flex-col h-full relative"
              >
                {/* Visual Preview */}
                <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden border-b border-slate-50">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt={post.title}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                      <ImageIcon size={40} strokeWidth={1} />
                      <p className="text-[9px] font-bold uppercase mt-2">
                        No Thumbnail
                      </p>
                    </div>
                  )}

                  {/* Category Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-primary text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm border border-white/20">
                      {post.category || "General"}
                    </span>
                  </div>

                  {/* Actions Overlay (Floating Style) */}
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setIsModalOpen(true);
                      }}
                      className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="w-12 h-12 bg-white text-rose-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Info Area */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-slate-400">
                    <Calendar size={14} className="text-accent" />
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  <h3 className="font-bold text-primary text-xl mb-6 line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-300 tracking-tight">
                    {post.title}
                  </h3>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] group/link hover:text-accent transition-colors"
                    >
                      Live View
                      <ExternalLink
                        size={14}
                        className="group-hover/link:translate-x-1 transition-transform"
                      />
                    </a>

                    {/* SEO Indicator Placeholder */}
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        Indexed
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full py-40 text-center bg-white rounded-[bento] border-2 border-dashed border-slate-100">
              <FileText
                size={48}
                className="mx-auto text-slate-100 mb-4"
                strokeWidth={1}
              />
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                Belum ada artikel yang diterbitkan.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODAL LAYER --- */}
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
