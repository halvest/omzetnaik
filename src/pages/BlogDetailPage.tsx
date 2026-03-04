// src/pages/BlogDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../utils/supabase";
import { Calendar, User, ArrowLeft, Tag, Loader2, Share2 } from "lucide-react";
import toast from "react-hot-toast";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-[#FF3B3B] animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F1F4A]">
          Menyelaraskan Konten...
        </p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="pt-32 pb-20 bg-[#F8FAFC] min-h-screen font-sans">
      <Helmet>
        <title>{post.title} | OmzetNaik.id Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto px-6 max-w-4xl">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0F1F4A] font-bold text-xs uppercase tracking-widest transition-all group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali ke Blog
          </Link>
          <button
            onClick={handleShare}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-[#FF3B3B] transition-all"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative group mb-12">
          <div className="absolute inset-0 bg-[#0F1F4A] rounded-[3rem] rotate-1 scale-[1.02] opacity-5 -z-10 group-hover:rotate-0 transition-transform duration-500"></div>
          <img
            src={
              post.image_url ||
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
            }
            alt={post.title}
            className="w-full aspect-video object-cover rounded-[3rem] shadow-2xl border-4 border-white"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-20 shadow-xl shadow-primary/5 border border-slate-50 relative overflow-hidden">
          {/* Accent Element */}
          <div className="absolute top-0 left-0 w-2 h-32 bg-[#FF3B3B]"></div>

          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 pb-8 border-b border-slate-50">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[#FF3B3B]" />
                {new Date(post.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <User size={14} className="text-[#FF3B3B]" />{" "}
                {post.profiles?.name || "OmzetNaik Team"}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-[#0F1F4A]/5 text-[#0F1F4A] rounded-full">
                <Tag size={12} /> {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-[#0F1F4A] leading-[1.1] tracking-tighter">
              {post.title}
            </h1>
          </header>

          {/* Render Content from Tiptap */}
          <div
            className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-heading prose-headings:text-[#0F1F4A] prose-headings:font-black prose-headings:tracking-tighter
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-strong:text-[#0F1F4A] prose-strong:font-bold
              prose-img:rounded-[2rem] prose-img:shadow-lg
              prose-a:text-[#FF3B3B] prose-a:font-bold hover:prose-a:text-[#0F1F4A]
              prose-blockquote:border-l-[#FF3B3B] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl
              font-sans"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-400 font-medium italic">
              © 2026 OmzetNaik.id - Akselerasi Bisnis & Properti
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase text-slate-300">
                Bagikan Artikel:
              </span>
              <button
                onClick={handleShare}
                className="text-[#0F1F4A] hover:text-[#FF3B3B] transition-colors font-bold text-xs"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
