import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { supabase } from "../utils/supabase";

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4">
              <BookOpen size={14} className="text-accent" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Wawasan Bisnis
              </span>
            </div>
            <h2 className="text-4xl font-heading font-extrabold text-primary">
              Update & <span className="text-accent italic">Edukasi.</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-primary font-bold flex items-center gap-2 hover:text-accent transition-colors mt-4 md:mt-0"
          >
            Lihat Semua Artikel <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <div className="rounded-[2rem] overflow-hidden border border-border bg-white hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase mb-3">
                    <Calendar size={12} />
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 font-sans">
                    {post.excerpt}
                  </p>
                  <span className="mt-auto text-primary font-bold text-xs uppercase flex items-center gap-2">
                    Baca Selengkapnya <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
