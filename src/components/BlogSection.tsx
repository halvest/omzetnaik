import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { supabase } from "../utils/supabase";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <section className="relative min-h-screen lg:h-screen flex items-center py-12 lg:py-0 bg-white font-sans overflow-hidden lg:max-h-[900px]">
      <div className="container relative z-10 px-6 mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-12 gap-6 text-center lg:text-left">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 shadow-sm rounded-full mb-4"
            >
              <Sparkles size={12} className="text-accent" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                Wawasan Bisnis
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] tracking-tighter">
              Update &{" "}
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic">
                  Edukasi.
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 -z-10 rounded-full" />
              </span>
            </h2>
          </div>

          <Link
            to="/blog"
            className="group hidden lg:inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-all"
          >
            Lihat Semua Artikel
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <ChevronRight size={18} />
            </div>
          </Link>
        </div>

        {/* --- BLOG GRID (Dibatasi 3 Item) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  {/* Image: Cinematic Aspect Ratio */}
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Content Area - Lebih Padat */}
                  <div className="p-6 lg:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-3">
                      <Calendar size={12} className="text-accent" />
                      {new Date(post.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-tight tracking-tight line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium opacity-90">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest group-hover:text-accent transition-colors">
                        Baca Artikel
                      </span>
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* --- MOBILE FOOTER --- */}
        <div className="mt-10 lg:hidden px-4">
          <Link
            to="/blog"
            className="w-full py-4 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-lg"
          >
            Lihat Semua Artikel <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
