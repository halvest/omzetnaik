// src/pages/BlogDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../utils/supabase";
import {
  Calendar,
  User,
  ArrowLeft,
  Tag,
  Loader2,
  Share2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*, profiles(name)")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          toast.error("Artikel tidak ditemukan");
          navigate("/blog");
          return;
        }

        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link berhasil disalin!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Menyelaraskan Konten...
        </p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="pt-32 pb-20 bg-slate-50 min-h-screen font-sans">
      <Helmet>
        <title>{post.title} | OmzetNaik.id Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container relative z-10 max-w-4xl">
        {/* TOP NAVIGATION & ACTIONS */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali ke Blog
          </Link>
          <button
            onClick={handleShare}
            className="p-3 bg-white rounded-2xl shadow-premium border border-slate-100 text-slate-400 hover:text-accent transition-all duration-300 active:scale-90"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* HERO IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-[bento] translate-y-4 scale-[1.02] -z-10 blur-xl"></div>
          <img
            src={
              post.image_url ||
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
            }
            alt={post.title}
            className="w-full aspect-[21/9] object-cover rounded-[bento] shadow-premium border border-white"
          />
        </motion.div>

        {/* ARTICLE HEADER & CONTENT CONTAINER */}
        <div className="bg-white rounded-[bento] p-8 md:p-16 lg:p-24 shadow-premium border border-slate-50 relative">
          {/* Subtle Vertical Accent Line */}
          <div className="absolute top-0 left-0 w-1.5 h-40 bg-accent rounded-br-full opacity-80"></div>

          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 pb-10 border-b border-slate-50">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-accent" />
                {new Date(post.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <User size={14} className="text-accent" />{" "}
                {post.profiles?.name || "OmzetNaik Team"}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-primary rounded-full border border-slate-100">
                <Tag size={12} className="text-accent" />{" "}
                {post.category || "Marketing"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-[1.05] tracking-tighter mb-8">
              {post.title}
            </h1>

            {/* Lead Text / Excerpt */}
            <p className="text-xl text-slate-500 font-medium leading-relaxed tracking-tight">
              {post.excerpt}
            </p>
          </header>

          {/* MAIN CONTENT (Typography Refinement) */}
          <div
            className="prose prose-lg lg:prose-xl prose-slate max-w-none 
              prose-headings:text-primary prose-headings:font-bold prose-headings:tracking-tighter
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
              prose-strong:text-primary prose-strong:font-bold
              prose-img:rounded-[2rem] prose-img:shadow-premium prose-img:my-12
              prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:text-primary transition-colors
              prose-blockquote:border-l-accent prose-blockquote:bg-slate-50 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-500
              prose-li:text-slate-600
              font-sans"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ARTICLE FOOTER */}
          <footer className="mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Clock size={18} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium italic">
                Dipublikasikan oleh OmzetNaik Editorial Team. <br />© 2026
                OmzetNaik.id - Akselerasi Bisnis & Properti
              </p>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                Bagikan:
              </span>
              <button
                onClick={handleShare}
                className="btn-primary !px-6 !py-2.5 !text-[10px] tracking-[0.2em]"
              >
                Copy Link
              </button>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
