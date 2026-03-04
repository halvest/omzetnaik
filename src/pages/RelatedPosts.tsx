// src/components/RelatedPosts.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
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
        .neq("id", currentPostId) // Jangan tampilkan artikel yang sedang dibaca
        .limit(3)
        .order("created_at", { ascending: false });

      if (data) setRelated(data);
    };

    if (currentCategoryId) fetchRelated();
  }, [currentCategoryId, currentPostId]);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 border-t border-slate-100 pt-16">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-heading font-extrabold text-[#0F1F4A] tracking-tight">
            Baca <span className="text-[#FF3B3B]">Selanjutnya</span>
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Konten Relevan Untuk Anda
          </p>
        </div>
        <Link
          to="/blog"
          className="text-[10px] font-black uppercase tracking-widest text-[#0F1F4A] hover:text-[#FF3B3B] transition-colors flex items-center gap-2"
        >
          Lihat Semua <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((post) => (
          <motion.div whileHover={{ y: -8 }} key={post.id} className="group">
            <Link to={`/blog/${post.slug}`}>
              <div className="aspect-[16/10] overflow-hidden rounded-[2rem] mb-5 shadow-lg shadow-primary/5">
                <img
                  src={
                    post.image_url ||
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                  }
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={post.title}
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
                <Clock size={12} className="text-[#FF3B3B]" />
                {new Date(post.created_at).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <h4 className="font-heading font-extrabold text-[#0F1F4A] leading-tight group-hover:text-[#FF3B3B] transition-colors line-clamp-2">
                {post.title}
              </h4>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
