// src/components/RelatedPosts.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export default function RelatedPosts({
  currentCategoryId,
  currentPostId,
}: {
  currentCategoryId: string;
  currentPostId: string;
}) {
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, image_url, created_at")
        .eq("category", currentCategoryId)
        .neq("id", currentPostId)
        .limit(3)
        .order("created_at", { ascending: false });

      if (data) setRelated(data);
    };

    if (currentCategoryId) fetchRelated();
  }, [currentCategoryId, currentPostId]);

  if (related.length === 0) return null;

  return (
    <section className="mt-32 border-t border-slate-100 pt-20">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 rounded-full border border-accent/10">
            <Sparkles size={12} className="text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
              Recommended
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-primary tracking-tighter">
            Baca <span className="text-accent italic">Selanjutnya.</span>
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            Eksplorasi wawasan strategi marketing lainnya dari tim ahli kami.
          </p>
        </div>

        <Link
          to="/blog"
          className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-all duration-300"
        >
          Lihat Semua Insights
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* --- GRID CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {related.map((post, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            key={post.id}
            className="group"
          >
            <Link to={`/blog/${post.slug}`} className="block space-y-5">
              {/* Image Container with Ambient Shadow */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-premium group-hover:shadow-premium-hover transition-all duration-500">
                <img
                  src={
                    post.image_url ||
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                  }
                  className="w-full h-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-110"
                  alt={post.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <div className="w-6 h-px bg-slate-200" />
                <Calendar size={12} className="text-accent" />
                {new Date(post.created_at).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              {/* Title */}
              <h4 className="text-xl font-bold text-primary leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2 tracking-tight px-1">
                {post.title}
              </h4>

              {/* Minimalist Action Link */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 px-1">
                Read Article <ArrowRight size={12} className="text-accent" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
