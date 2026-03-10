// src/pages/BlogPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../utils/supabase";
import {
  Calendar,
  ArrowRight,
  Search,
  BookOpen,
  ChevronRight,
} from "lucide-react";
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
    <div className="bg-slate-50 min-h-screen pt-32 pb-20 font-sans">
      <Helmet>
        <title>Blog & Wawasan Digital Marketing | OmzetNaik.id</title>
        <meta
          name="description"
          content="Pelajari strategi terbaru seputar Meta Ads, SEO, dan digital marketing untuk industri properti di blog OmzetNaik.id."
        />
      </Helmet>

      {/* --- HEADER SECTION --- */}
      <div className="container relative z-10 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full mb-8"
        >
          <BookOpen size={14} className="text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Pusat Edukasi
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-8 leading-[1.05] tracking-tighter"
        >
          Wawasan &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
            Strategi.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto text-lg lg:text-xl font-medium leading-relaxed"
        >
          Temukan tips praktis dan analisis mendalam untuk mengakselerasi
          pertumbuhan bisnis Anda di era digital.
        </motion.p>
      </div>

      {/* --- SEARCH BAR (Refined) --- */}
      <div className="container mb-24 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
            size={22}
          />
          <input
            type="text"
            placeholder="Cari topik marketing..."
            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-premium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-700 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="container">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-[bento] h-[500px] animate-pulse border border-slate-100 shadow-sm"
              />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.2, 0, 0, 1],
                }}
                className="group flex flex-col bg-white rounded-[bento] overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-slate-100"
                >
                  <img
                    src={
                      post.image_url ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg border border-white/10">
                      {post.category || "Marketing"}
                    </span>
                  </div>
                </Link>

                <div className="p-8 lg:p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-accent" />
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-5 group-hover:text-accent transition-colors line-clamp-2 leading-[1.2] tracking-tight">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-slate-500 text-base leading-relaxed line-clamp-3 mb-10 font-medium opacity-90">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-[0.2em] group/btn hover:text-accent transition-colors"
                    >
                      Baca Selengkapnya
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[bento] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">
              Artikel tidak ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
