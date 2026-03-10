// src/components/BlogSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, ChevronRight } from "lucide-react";
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
    <section className="py-24 lg:py-40 bg-white font-sans overflow-hidden">
      <div className="container relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 shadow-sm rounded-full mb-6"
            >
              <BookOpen size={14} className="text-accent" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Wawasan Bisnis
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tighter">
              Update &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                Edukasi.
              </span>
            </h2>
          </div>

          <Link
            to="/blog"
            className="group hidden lg:inline-flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-all"
          >
            Lihat Semua Artikel
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
              <ChevronRight size={20} />
            </div>
          </Link>
        </div>

        {/* --- BLOG GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.2, 0, 0, 1],
              }}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-white rounded-[bento] overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  {/* Image: Cinematic Aspect Ratio */}
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-premium"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content Area */}
                  <div className="p-8 lg:p-10 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                      <Calendar size={12} className="text-accent" />
                      {new Date(post.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300 leading-tight tracking-tight line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-3 font-medium opacity-90">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                        Baca Artikel
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* --- MOBILE FOOTER --- */}
        <div className="mt-12 lg:hidden px-4">
          <Link
            to="/blog"
            className="btn-primary w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-accent-glow"
          >
            Lihat Semua Artikel <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
