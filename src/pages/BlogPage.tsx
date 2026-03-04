// src/pages/BlogPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../utils/supabase";
import { Calendar, User, ArrowRight, Search, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  category: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-[#F5F7FB] min-h-screen pt-32 pb-20">
      <Helmet>
        <title>Blog & Wawasan Digital Marketing | OmzetNaik.id</title>
        <meta
          name="description"
          content="Pelajari strategi terbaru seputar Meta Ads, SEO, dan digital marketing untuk industri properti di blog OmzetNaik.id."
        />
      </Helmet>

      {/* --- HEADER SECTION --- */}
      <div className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-6"
        >
          <BookOpen size={16} className="text-[#FF3B3B]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F1F4A]">
            Pusat Edukasi
          </span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-[#0F1F4A] mb-6 leading-tight">
          Wawasan & <span className="text-[#FF3B3B] italic">Strategi.</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-sans">
          Temukan tips praktis dan analisis mendalam untuk mengakselerasi
          pertumbuhan bisnis Anda di era digital.
        </p>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="container mx-auto px-6 mb-16 max-w-2xl">
        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF3B3B] transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari topik marketing..."
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-primary/5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="container mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-slate-50"
              />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] overflow-hidden"
                >
                  <img
                    src={
                      post.image_url ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#0F1F4A] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {post.category || "Marketing"}
                    </span>
                  </div>
                </Link>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#FF3B3B]" />
                      {new Date(post.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-heading font-bold text-[#0F1F4A] mb-4 group-hover:text-[#FF3B3B] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 font-sans">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-auto flex items-center gap-2 text-[#0F1F4A] font-black text-[10px] uppercase tracking-[0.2em] group/btn"
                  >
                    Selengkapnya
                    <ArrowRight
                      size={14}
                      className="group-hover/btn:translate-x-2 transition-transform text-[#FF3B3B]"
                    />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 font-bold uppercase tracking-widest">
              Artikel tidak ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
